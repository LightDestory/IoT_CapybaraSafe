#include "ble_communication.h"

namespace BLE_COM {

    NimBLEServer *BLEServerInstance = nullptr;
    NimBLEService *BLEServiceInstance = nullptr;
    NimBLECharacteristic *BLEIDCharacteristicInstance = nullptr;
    NimBLEDescriptor *BLEIDDescriptorInstance = nullptr;
    NimBLEScan *BLEScanInstance = nullptr;
    NimBLEClient *BLEClientInstance = nullptr;
    NimBLEAdvertising *BLEAdvertisingInstance = nullptr;
    NimBLEUUID ServiceBLUEUUIDInstance(SERVICE_UUID.c_str());
    bool isBLEServing = false;
    bool isBLEBusy = false;
    MatchState regexMatchState;
    uint16_t connectionTimeout = 0;

    /**
     * @brief Initialize the BLE stack and create the server, client and scan instances
     * @return True if the BLE stack is initialized successfully, false otherwise
     */
    bool initBLEStack() {
        SERIAL_LOGGER::log("Initializing BLE Stack...");
        NimBLEDevice::init(PERSISTENCE::getDeviceName().c_str());
        BLEServerInstance = NimBLEDevice::createServer();
        if (BLEServerInstance == nullptr) {
            return false;
        }
        BLEClientInstance = NimBLEDevice::createClient();
        if (BLEClientInstance == nullptr) {
            return false;
        }
        BLEScanInstance = NimBLEDevice::getScan();
        if (BLEScanInstance == nullptr) {
            return false;
        }
        return true;
    }

    /**
     * @brief Initialize the BLE service for the device.
     * It can be a setup service
     * Setup service lets the operator set the device ID
     * @return True if the service is initialized successfully, false otherwise
     */
    bool initBLEService() {
        SERIAL_LOGGER::log("Initializing BLE Service...");
        BLEServiceInstance = BLEServerInstance->createService(SERVICE_UUID.c_str());
        if (BLEServiceInstance == nullptr) {
            return false;
        }
        BLEIDCharacteristicInstance = BLEServiceInstance->createCharacteristic(
                ID_CHARACTERISTIC_UUID.c_str(),
                NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE
        );
        if (BLEIDCharacteristicInstance == nullptr) {
            return false;
        }
        BLEIDCharacteristicInstance->setCallbacks(new BLE_COM::requestSetupCallbacks());
        BLEIDDescriptorInstance = BLEIDCharacteristicInstance->createDescriptor(
                ID_DESCRIPTOR_UUID.c_str(),
                NIMBLE_PROPERTY::READ
        );
        if (BLEIDDescriptorInstance == nullptr) {
            return false;
        }
        BLEAdvertisingInstance = NimBLEDevice::getAdvertising();
        if (BLEAdvertisingInstance == nullptr) {
            return false;
        }
        BLEAdvertisingInstance->addServiceUUID(SERVICE_UUID.c_str());
        // First start the Service and then set the default values
        if (!BLEServiceInstance->start()) {
            return false;
        }
        BLEIDCharacteristicInstance->setValue("UNSET");
        BLEIDDescriptorInstance->setValue("The device ID");
        // Start the advertising
        if (!BLEAdvertisingInstance->start()) {
            return false;
        }
        isBLEServing = true;
        return true;
    }

    /**
     * @brief Callback for the ID characteristic write operation
     * @param pCharacteristic The characteristic that was written
     */
    void requestSetupCallbacks::onWrite(NimBLECharacteristic *pCharacteristic) {
        String newID = pCharacteristic->getValue();
        if (newID.length() > 0) {
            if (newID.toInt() != 0) {
                PERSISTENCE::preferences.putUInt("ID", newID.toInt());
                SERIAL_LOGGER::log(String("Received value: ") + newID.c_str());
                GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::SETUP_COMPLETE;
                BLEDevice::deinit(true);
            }
        }
    }

    /**
     * @brief Notify an alert to the device
     * @param address The address of the device
     * @param message The message to send
     */
    void writeAlert(const NimBLEAddress &address, const String &message) {
        while (isBLEBusy) {
            delay(20);
        }
        isBLEBusy = true;
        connectionTimeout = 0;
        while (!BLEClientInstance->connect(address)) {
            delay(20);
            connectionTimeout += 1;
            if (connectionTimeout > CONNECTION_TIMEOUT) {
                SERIAL_LOGGER::log("Failed to connect to the device, skipping...");
                DATA_STRUCTURES::setUnreachableDevice(address);
                isBLEBusy = false;
                return;
            }
        }
        SERIAL_LOGGER::log("Connected to the device, writing alert...");
        NimBLERemoteService *PD_service = BLEClientInstance->getService(SERVICE_UUID.c_str());
        if (PD_service != nullptr) {
            NimBLERemoteCharacteristic *alertCh = PD_service->getCharacteristic(
                    ALERT_CHARACTERISTIC_UUID.c_str());
            if (alertCh != nullptr) {
                String value = "{\"message\":\"" + message + "\"}";
                alertCh->writeValue(value.c_str());
                SERIAL_LOGGER::log("Alert sent to the device");
            }
        }
        BLEClientInstance->disconnect();
        isBLEBusy = false;
    }

    void notifyAlert(const int16_t &activity_id, const String &message) {
        if (activity_id == 0) {
            SERIAL_LOGGER::log("Broadcasting alert to all devices");
            for (DATA_STRUCTURES::device_descriptor &descriptor: GLOBALS::devices) {
                writeAlert(NimBLEAddress(descriptor.device), message);
            }
        } else {
            SERIAL_LOGGER::log("Broadcasting alert to activity: " + String(activity_id));
            for (DATA_STRUCTURES::device_descriptor &descriptor: GLOBALS::devices) {
                if (descriptor.a_id == activity_id) {
                    writeAlert(NimBLEAddress(descriptor.device), message);
                }
            }
        }
    }

    bool isValidDevice(char *name) {
        regexMatchState.Target(name);
        if (regexMatchState.Match(NAME_REGEX.c_str()) > 0) {
            return true;
        }
        return false;
    }

    /**
     * @brief Looks around for PD devices
     */
    void fetch_loop() {
        while (isBLEBusy) {
            delay(20);
        }
        isBLEBusy = true;
        SERIAL_LOGGER::log("Flushing existing devices...");
        DATA_STRUCTURES::flushUnreachableDevices();
        SERIAL_LOGGER::log("Scanning for devices...");
        NimBLEScanResults results = BLEScanInstance->start(6, false);
        NimBLEAdvertisedDevice device;
        JsonDocument doc;
        for (int i = 0; i < results.getCount(); i++) {
            device = results.getDevice(i);
            if (!device.haveName())
                continue;
            if (!isValidDevice((char *) device.getName().c_str()))
                continue;
            uint8_t device_id = (uint8_t) (DATA_STRUCTURES::getValueFromEncodedData(String(device.getName().c_str()),
                                                                                    '_', 1).toInt());
            SERIAL_LOGGER::log("Interrogating device: " + String(device_id));
            if (!device.isAdvertisingService(ServiceBLUEUUIDInstance)) {
                SERIAL_LOGGER::log("Device is not advertising the service, skipping...");
                continue;
            }
            connectionTimeout = 0;
            while (!BLEClientInstance->connect(device.getAddress())) {
                delay(20);
                connectionTimeout += 1;
                if (connectionTimeout > CONNECTION_TIMEOUT) {
                    SERIAL_LOGGER::log("Failed to connect to the device, skipping...");
                    continue;
                }
            }
            NimBLERemoteService *PD_service = BLEClientInstance->getService(SERVICE_UUID.c_str());
            if (PD_service != nullptr) {
                NimBLERemoteCharacteristic *tracking_ch = PD_service->getCharacteristic(
                        TRACKING_CHARACTERISTIC_UUID.c_str());
                if (tracking_ch != nullptr) {
                    std::string data = tracking_ch->readValue();
                    doc.clear();
                    deserializeJson(doc, data);
                    doc["rssi"] = device.getRSSI();
                    doc["anchor_id"] = PERSISTENCE::preferences.getUInt("ID");
                    String parsedData = DATA_STRUCTURES::convertBLEJsonDataToLoRa(doc);
                    if (parsedData.length() > 0) {
                        SERIAL_LOGGER::log("Data Encoded: " + parsedData);
                        DATA_STRUCTURES::device_descriptor *found = nullptr;
                        for (DATA_STRUCTURES::device_descriptor &device_it: GLOBALS::devices) {
                            if (device_it.d_id == device_id) {
                                found = &device_it;
                                found->unreachable = false;
                                break;
                            }
                        }
                        if (found == nullptr) {
                            SERIAL_LOGGER::log("New device found: " + String(device_id));
                            GLOBALS::devices.push_back({
                                                               device.getAddress(),
                                                               doc["d_id"].as<uint8_t>(),
                                                               doc["a_id"].as<int16_t>(),
                                                               false
                                                       });
                        }
                        GLOBALS::messages_queue.push_back(parsedData);
                    }
                }
            }
            BLEClientInstance->disconnect();
        }
        isBLEBusy = false;
    }
}
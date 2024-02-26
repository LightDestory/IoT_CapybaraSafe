#include "ble_communication.h"

namespace BLE_COM {

    NimBLEServer *BLEServerInstance = nullptr;
    NimBLEService *BLEServiceInstance = nullptr;
    NimBLECharacteristic *BLEIDCharacteristicInstance = nullptr;
    NimBLEDescriptor *BLEIDDescriptorInstance = nullptr;
    NimBLECharacteristic *BLETrackingCharacteristicInstance = nullptr;
    NimBLEDescriptor *BLETrackingDescriptorInstance = nullptr;
    NimBLECharacteristic *BLEAlertCharacteristicInstance = nullptr;
    NimBLEDescriptor *BLEAlertDescriptorInstance = nullptr;
    NimBLEAdvertising *BLEAdvertisingInstance = nullptr;
    bool isBLEServing = false;

    /**
     * @brief Initialize the BLE stack and create the server instance
     * @return True if the BLE stack is initialized successfully, false otherwise
     */
    bool initBLEStack() {
        SERIAL_LOGGER::log("Initializing BLE Stack...");
        NimBLEDevice::init(PERSISTENCE::getDeviceName().c_str());
        BLEServerInstance = NimBLEDevice::createServer();
        if (BLEServerInstance == nullptr) {
            return false;
        }
        return true;
    }

    /**
     * @brief Initialize the BLE service for the device.
     * It can be a setup service or a data service
     * Setup service lets the operator set the device ID
     * Data service lets the anchors read data from the tracking device and send alerts
     * @return True if the service is initialized successfully, false otherwise
     */
    bool initBLEService(SERVICE_TYPE serviceType) {
        SERIAL_LOGGER::log("Initializing BLE Service...");
        BLEServiceInstance = BLEServerInstance->createService(SERVICE_UUID.c_str());
        if (BLEServiceInstance == nullptr) {
            return false;
        }
        if (serviceType == SETUP_SERVICE) {
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
        } else {
            BLETrackingCharacteristicInstance = BLEServiceInstance->createCharacteristic(
                    TRACKING_CHARACTERISTIC_UUID.c_str(),
                    NIMBLE_PROPERTY::READ
            );
            if (BLETrackingCharacteristicInstance == nullptr) {
                return false;
            }
            BLETrackingDescriptorInstance = BLETrackingCharacteristicInstance->createDescriptor(
                    TRACKING_DESCRIPTOR_UUID.c_str(),
                    NIMBLE_PROPERTY::READ
            );
            if (BLETrackingDescriptorInstance == nullptr) {
                return false;
            }

            BLEAlertCharacteristicInstance = BLEServiceInstance->createCharacteristic(
                    ALERT_CHARACTERISTIC_UUID.c_str(),
                    NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE
            );
            if (BLEAlertCharacteristicInstance == nullptr) {
                return false;
            }
            BLEAlertDescriptorInstance = BLEAlertCharacteristicInstance->createDescriptor(
                    ALERT_DESCRIPTOR_UUID.c_str(),
                    NIMBLE_PROPERTY::READ
            );
            BLEAlertCharacteristicInstance->setCallbacks(new BLE_COM::notifyAlertCallbacks());
            if (BLEAlertDescriptorInstance == nullptr) {
                return false;
            }
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
        if (serviceType == SETUP_SERVICE) {
            BLEIDCharacteristicInstance->setValue("UNSET");
            BLEIDDescriptorInstance->setValue("The device ID");
        } else {
            BLETrackingCharacteristicInstance->setValue("{}");
            BLETrackingDescriptorInstance->setValue("The tracking data");
            BLEAlertCharacteristicInstance->setValue("{}");
            BLEAlertDescriptorInstance->setValue("The latest alert received");
        }
        // Start the advertising
        if (!BLEAdvertisingInstance->start()) {
            return false;
        }
        isBLEServing = true;
        return true;
    }


    /*
     * @brief Update the tracking characteristic with the latest data
     * @param argv The argument to be passed to the task
     */
    void updateDataCharacteristic(void *argv) {
        while (true) {
            TRACKING_SERVICE::updateTrackingData();
            const String serialized = TRACKING_SERVICE::serializedData();
            SERIAL_LOGGER::log(String("Updating Tracking Data: ") + serialized);
            BLETrackingCharacteristicInstance->setValue(serialized);
            delay(5000);
        }
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
     * @brief Callback for the Alert characteristic write operation
     * @param pCharacteristic The characteristic that was written
     */
    void notifyAlertCallbacks::onWrite(NimBLECharacteristic *pCharacteristic) {
        //String newAlert = pCharacteristic->getValue();
        //if (newAlert.length() > 0) {
        //    if (newAlert.toInt() != 0) {
        //        SERIAL_LOGGER::log(String("Received value: ") + newAlert.c_str());
        //        DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::alert, "Alert Received", 900);
        //    }
        //}
    }
}
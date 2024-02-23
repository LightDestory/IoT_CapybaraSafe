#include "ble_communication.h"
#include "../display/display.h"
#include "../utils/serial_logger/serial_logger.h"
#include "../persistence/persistence.h"

NimBLEServer* BLE_COM::BLEServerInstance = nullptr;
NimBLEService* BLE_COM::BLEServiceInstance = nullptr;
NimBLECharacteristic* BLE_COM::BLECharacteristicInstance = nullptr;
NimBLEDescriptor* BLE_COM::BLEDescriptorInstance = nullptr;
NimBLEAdvertising* BLE_COM::BLEAdvertisingInstance = nullptr;

bool BLE_COM::isBLEServing = false;

bool BLE_COM::initBLE() {
    SERIAL_LOGGER::log("Initializing BLE Stack...");
    NimBLEDevice::init(PERSISTENCE::getDeviceName().c_str());
    BLEServerInstance = NimBLEDevice::createServer();
    if (BLEServerInstance == nullptr) {
        return false;
    }
    return true;
}

bool BLE_COM::initSetupService() {
    SERIAL_LOGGER::log("Initializing Setup Service...");
    BLEServiceInstance = BLEServerInstance->createService(SERVICE_UUID.c_str());
    if (BLEServiceInstance == nullptr) {
        return false;
    }
    BLECharacteristicInstance = BLEServiceInstance->createCharacteristic(
            CHARACTERISTIC_UUID.c_str(),
            NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE
    );
    if (BLECharacteristicInstance == nullptr) {
        return false;
    }
    BLEDescriptorInstance = BLECharacteristicInstance->createDescriptor(
            DESCRIPTOR_UUID.c_str(),
            NIMBLE_PROPERTY::READ
    );
    BLECharacteristicInstance->setCallbacks(new BLE_COM::requestSetupCallbacks());
    if (BLEDescriptorInstance == nullptr) {
        return false;
    }
    BLEAdvertisingInstance = NimBLEDevice::getAdvertising();
    if (BLEAdvertisingInstance == nullptr) {
        return false;
    }
    BLEAdvertisingInstance->addServiceUUID(SERVICE_UUID.c_str());
    // First start the Service and then set the default values
    if(!BLEServiceInstance->start()) {
        return false;
    }
    BLECharacteristicInstance->setValue("UNSET");
    BLEDescriptorInstance->setValue("The device ID");
    // Start the advertising
    if(!BLEAdvertisingInstance->start()) {
        return false;
    }
    isBLEServing = true;
    return true;
}

void BLE_COM::requestSetupCallbacks::onWrite(NimBLECharacteristic *pCharacteristic) {
    String newID = pCharacteristic->getValue();
    if (newID.length() > 0){
        if(newID.toInt() != 0){
            PERSISTENCE::preferences.putUInt("ID", newID.toInt());
            SERIAL_LOGGER::log(String("Received value: ") + newID.c_str());
            GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::SETUP_COMPLETE;
            BLEDevice::deinit(true);
        }
    }
}

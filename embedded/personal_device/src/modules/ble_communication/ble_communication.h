
#ifndef PERSONAL_DEVICE_BLE_COMMUNICATION_H
#define PERSONAL_DEVICE_BLE_COMMUNICATION_H

#include <Arduino.h>
#include "NimBLEDevice.h"

namespace BLE_COM {

    const String SERVICE_UUID = "A699CE92-66CA-4432-9EEB-E3AF7A4AD403";
    const String CHARACTERISTIC_UUID = "FAEDB95A-AD5C-41CF-A9B0-F8297992CA0D";
    const String DESCRIPTOR_UUID = "6E4D3196-E11A-4C0F-904A-30B30F56B704";

    class requestSetupCallbacks : public NimBLECharacteristicCallbacks {
        void onWrite(NimBLECharacteristic* pCharacteristic) override;
    };

    bool initBLE();

    bool initSetupService();

    extern bool isBLEServing;
    extern NimBLEServer* BLEServerInstance;
    extern NimBLEService* BLEServiceInstance;
    extern NimBLECharacteristic* BLECharacteristicInstance;
    extern NimBLEDescriptor* BLEDescriptorInstance;
    extern NimBLEAdvertising* BLEAdvertisingInstance;
}

#endif //PERSONAL_DEVICE_BLE_COMMUNICATION_H

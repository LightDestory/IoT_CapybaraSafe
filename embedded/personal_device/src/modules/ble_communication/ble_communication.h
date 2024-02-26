#ifndef BLE_COMMUNICATION_H
#define BLE_COMMUNICATION_H

#include <Arduino.h>
#include "NimBLEDevice.h"
#include "../display/display.h"
#include "../utils/serial_logger/serial_logger.h"
#include "../persistence/persistence.h"

namespace BLE_COM {
    // Service types
    enum SERVICE_TYPE {
        SETUP_SERVICE,
        DATA_SERVICE
    };

    // BLE UUIDs to identify the resources
    const String SERVICE_UUID = "A699CE92-66CA-4432-9EEB-E3AF7A4AD403";
    const String ID_CHARACTERISTIC_UUID = "FAEDB95A-AD5C-41CF-A9B0-F8297992CA0D";
    const String ID_DESCRIPTOR_UUID = "6E4D3196-E11A-4C0F-904A-30B30F56B704";
    const String TRACKING_CHARACTERISTIC_UUID = "4C4DC349-A999-4420-BDE9-720DCD656BF1";
    const String TRACKING_DESCRIPTOR_UUID = "FABF129A-28A0-484A-A423-99DC5EBB6C6E";
    const String ALERT_CHARACTERISTIC_UUID = "443BC22A-E15F-4CEE-8F99-EC16D55E1C50";
    const String ALERT_DESCRIPTOR_UUID = "A6B91C13-215D-4FB3-A7D6-E0F0649D7753";

    // Characteristic operation callbacks
    class requestSetupCallbacks : public NimBLECharacteristicCallbacks {
        void onWrite(NimBLECharacteristic *pCharacteristic) override;
    };

    class notifyAlertCallbacks : public NimBLECharacteristicCallbacks {
        void onWrite(NimBLECharacteristic *pCharacteristic) override;
    };

    // Initialize the BLE stack
    bool initBLEStack();

    // Init the BLE service for the device
    bool initBLEService(SERVICE_TYPE serviceType);

    // Generic stuff
    extern bool isBLEServing;
    extern NimBLEServer *BLEServerInstance;
    extern NimBLEService *BLEServiceInstance;
    extern NimBLECharacteristic *BLEIDCharacteristicInstance;
    extern NimBLEDescriptor *BLEIDDescriptorInstance;
    extern NimBLECharacteristic *BLETrackingCharacteristicInstance;
    extern NimBLEDescriptor *BLETrackingDescriptorInstance;
    extern NimBLECharacteristic *BLEAlertCharacteristicInstance;
    extern NimBLEDescriptor *BLEAlertDescriptorInstance;
    extern NimBLEAdvertising *BLEAdvertisingInstance;
}

#endif // BLE_COMMUNICATION_H

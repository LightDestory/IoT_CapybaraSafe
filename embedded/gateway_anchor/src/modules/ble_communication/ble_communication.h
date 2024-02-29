#ifndef BLE_COMMUNICATION_H
#define BLE_COMMUNICATION_H

#include <Arduino.h>
#include "NimBLEDevice.h"
#include "../display/display.h"
#include "../utils/serial_logger/serial_logger.h"
#include "../persistence/persistence.h"
#include "../data_structures/data_structures.h"
#include "Regexp.h"

namespace BLE_COM {

    // BLE UUIDs to identify the resources
    const String SERVICE_UUID = "A699CE92-66CA-4432-9EEB-E3AF7A4AD403";
    const String ID_CHARACTERISTIC_UUID = "FAEDB95A-AD5C-41CF-A9B0-F8297992CA0D";
    const String ID_DESCRIPTOR_UUID = "6E4D3196-E11A-4C0F-904A-30B30F56B704";
    // TRACKING DEVICE DATA UUID
    const String TRACKING_CHARACTERISTIC_UUID = "4C4DC349-A999-4420-BDE9-720DCD656BF1";
    const String ALERT_CHARACTERISTIC_UUID = "443BC22A-E15F-4CEE-8F99-EC16D55E1C50";
    // Name Regex Check
    const String NAME_REGEX = "^PD_%d+$";

    const uint16_t CONNECTION_TIMEOUT = 2000;

    // Characteristic operation callbacks
    class requestSetupCallbacks : public NimBLECharacteristicCallbacks {
        void onWrite(NimBLECharacteristic *pCharacteristic) override;
    };

    // Initialize the BLE stack
    bool initBLEStack();

    // Init the BLE service for the device
    bool initBLEService();

    void fetch_loop();

    void writeAlert(const NimBLEAddress &address, const String &message);

    void notifyAlert(const int16_t &activity_id, const String &message);

    bool isValidDevice(char *name);

    // Generic stuff
    extern bool isBLEServing;
    extern NimBLEServer *BLEServerInstance;
    extern NimBLEService *BLEServiceInstance;
    extern NimBLECharacteristic *BLEIDCharacteristicInstance;
    extern NimBLEDescriptor *BLEIDDescriptorInstance;
    extern NimBLEAdvertising *BLEAdvertisingInstance;
    extern NimBLEScan *BLEScanInstance;
    extern NimBLEClient *BLEClientInstance;
    extern MatchState regexMatchState;
    extern NimBLEUUID ServiceBLUEUUIDInstance;
    extern bool isBLEBusy;
    extern uint16_t connectionTimeout;
}

#endif // BLE_COMMUNICATION_H

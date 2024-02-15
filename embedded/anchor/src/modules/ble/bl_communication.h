#ifndef IOT_ESP32_FIRMWARE_BL_COMMUNICATION_H
#define IOT_ESP32_FIRMWARE_BL_COMMUNICATION_H

#include <Arduino.h>
#include "modules/utils/serial_logger/serial_logger.h"
#include "../utils/globals.h"
#include <vector>
#include <BLEClient.h>
#include <BLEUUID.h>

namespace BLE_COM
{

    // BLE Stuff

    const String DEVICE_NAME = "CAPY-KING-ESP32";
    const std::map<String, String> SERVICE_UUIDS = {
        {"2a00", "Device Name"},
        {"2a01", "Appearance"},
        {"2a02", "Peripheral Privacy Flag"},
        {"2a03", "Reconnection Address"},
        {"2a04", "Peripheral Preferred Connection Parameters"},
        {"2a05", "Service Changed"},
        {"2a06", "Alert Level"},
        {"2a07", "Tx Power Level"},
        {"2a08", "Date Time"},
        {"2a09", "Day of Week"},
        {"2a0a", "Day Date Time"},
        {"2a0c", "Exact Time 256"},
        {"2a0d", "DST Offset"},
        {"2a0e", "Time Zone"},
        {"2a0f", "Local Time Information"},
        {"2a11", "Time with DST"},
        {"2a12", "Time Accuracy"},
        {"2a13", "Time Source"},
        {"2a14", "Reference Time Information"},
        {"2a16", "Time Update Control Point"},
        {"2a17", "Time Update State"},
        {"2a18", "Glucose Measurement"},
        {"2a19", "Battery Level"},
        {"2a1c", "Temperature Measurement"},
        {"2a1d", "Temperature Type"},
        {"2a1e", "Intermediate Temperature"},
        {"2a21", "Measurement Interval"},
        {"2a22", "Boot Keyboard Input Report"},
        {"2a23", "System ID"},
        {"2a24", "Model Number String"},
        {"2a25", "Serial Number String"},
        {"2a26", "Firmware Revision String"},
        {"2a27", "Hardware Revision String"},
        {"2a28", "Software Revision String"},
        {"2a29", "Manufacturer Name String"},
        {"2a2a", "IEEE 11073-20601 Regulatory Certification Data List"},
        {"2a2b", "Current Time"},
        {"2a31", "Scan Refresh"},
        {"2a32", "Boot Keyboard Output Report"},
        {"2a33", "Boot Mouse Input Report"},
        {"2a34", "Glucose Measurement Context"},
        {"2a35", "Blood Pressure Measurement"},
        {"2a36", "Intermediate Cuff Pressure"},
        {"2a37", "Heart Rate Measurement"},
        {"2a38", "Body Sensor Location"},
        {"2a39", "Heart Rate Control Point"},
        {"2a3f", "Alert Status"},
        {"2a40", "Ringer Control Point"},
        {"2a41", "Ringer Setting"},
        {"2a42", "Alert Category ID Bit Mask"},
        {"2a43", "Alert Category ID"},
        {"2a44", "Alert Notification Control Point"},
        {"2a45", "Unread Alert Status"},
        {"2a46", "New Alert"},
        {"2a47", "Supported New Alert Category"},
        {"2a48", "Supported Unread Alert Category"},
        {"2a49", "Blood Pressure Feature"},
        {"2a4a", "HID Information"},
        {"2a4b", "Report Map"},
        {"2a4c", "HID Control Point"},
        {"2a4d", "Report"},
        {"2a4e", "Protocol Mode"},
        {"2a4f", "Scan Interval Window"},
        {"2a50", "PnP ID"},
        {"2a51", "Glucose Feature"},
        {"2a52", "Record Access Control Point"},
        {"2a53", "RSC Measurement"},
        {"2a54", "RSC Feature"},
        {"2a55", "SC Control Point"},
        {"2a5b", "CSC Measurement"},
        {"2a5c", "CSC Feature"},
        {"2a5d", "Sensor Location"}};
    extern char local_addr[18];

    // Subroutines stuff
    const uint8_t IMPLEMENTED_SUBS = 4;
    extern GLOBALS::SUB_ROUTINE_STATE state;
    extern int8_t selection_workload_cursor;
    extern int8_t selected_workload;
    extern int8_t selection_device_cursor;
    extern int8_t selected_device;
    extern bool scan_device_executed;
    extern BLEClient *client;
    extern BLEScan *scanner;
    extern DATA_STRUCTURES::workload sub_menus[IMPLEMENTED_SUBS];
    extern std::vector<DATA_STRUCTURES::ble_device_descriptor> found_devices;

    class BLE_scanCallback : public BLEAdvertisedDeviceCallbacks
    {
        void onResult(BLEAdvertisedDevice advertisedDevice)
        {
            String log_message = "BLE Device found: \nAddress: ";
            String tmp = advertisedDevice.getAddress().toString().c_str();
            tmp.toUpperCase();
            log_message += tmp;
            if (advertisedDevice.haveName())
            {
                log_message += "\nName: ";
                tmp = advertisedDevice.getName().c_str();
                log_message += tmp;
            }
            SERIAL_LOGGER::log(log_message);
            BLE_COM::found_devices.push_back({tmp, advertisedDevice});
        }
    };

    void init();

    void looper();

    void displayMacAddr();

    void GATT_Client_DeviceName();

    void GATT_Client_BatteryLevel();

    void GATT_Client_Device_Connection();

    void GATT_Client_Discovery();

    void GATT_Client(String title, BLEUUID ServiceUUID, BLEUUID CharacteristicUUID);
}

#endif // IOT_ESP32_FIRMWARE_BL_COMMUNICATION_H
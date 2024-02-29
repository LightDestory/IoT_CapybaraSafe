#ifndef DATA_STRUCTURES_H
#define DATA_STRUCTURES_H

#include <Arduino.h>
#include "NimBLEAddress.h"
#include "ArduinoJson.h"


namespace DATA_STRUCTURES {
    typedef struct heart_sensor_data {
        float t;
        float s;
        float hr;
    } heart_sensor_data;

    typedef struct device_descriptor {
        NimBLEAddress device;
        uint8_t d_id;
        int16_t a_id;
        bool unreachable;
    } packed_device;

    typedef struct tracking_data {
        uint32_t d_id; // Device ID
        uint32_t w_id; // Worker ID
        uint32_t a_id; // Activity ID
        uint16_t hr; // Heart rate
        uint8_t sat; // Saturation
        float temp; // Temperature
        bool is_fall; // Is fall detected
        uint32_t p; // Progressive number
    } tracking_data;

    String convertMqttAlertToLoRa(const JsonDocument &alert);

    String convertBLEJsonDataToLoRa(const JsonDocument &doc);

    String convertLoRaToBLEJsonData(const String &data);

    JsonDocument convertLoraAlertToJSON(const String &data);

    String getValueFromEncodedData(const String &data, char separator, int index);

    void setUnreachableDevice(const NimBLEAddress &address);

    void flushUnreachableDevices();
}

#endif //DATA_STRUCTURES_H

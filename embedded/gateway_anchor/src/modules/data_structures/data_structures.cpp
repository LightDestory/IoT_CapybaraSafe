#include "data_structures.h"
#include "modules/machine_learning/tensorflow_runner.h"
#include "../utils/globals.h"

namespace DATA_STRUCTURES {
    /**
     * @brief Convert the JSON alert message to a LoRa message
     * @param alert The alert message in JSON Document format
     * @return The alert message in LoRa format
     */
    String convertMqttAlertToLoRa(const JsonDocument &alert) {
        uint8_t hop = alert.containsKey("hop") ? alert["hop"].as<uint8_t>() : 0;
        return "A|" + alert["activity_id"].as<String>() + "|" + alert["message"].as<String>() + "|" + String(hop);
    }

    /**
     * @brief Convert the LoRa alert message to a JSON message
     * @param data The LoRa Alert encoded message
     * @return A JSON Document with the alert message
     */
    JsonDocument convertLoraAlertToJSON(const String &data) {
        JsonDocument doc;
        doc["activity_id"] = getValueFromEncodedData(data, '|', 1);
        doc["message"] = getValueFromEncodedData(data, '|', 2);
        doc["hop"] = getValueFromEncodedData(data, '|', 3);
        return doc;
    }

    /**
     * @brief Convert the JSON tracking data message to a LoRa message
     * @param health The tracking message in JSON Document format
     * @return The tracking data message in LoRa format
     */
    String convertBLEJsonDataToLoRa(const JsonDocument &doc) {
        heart_sensor_data health_data;
        health_data.t = doc["temp"].as<float>();
        health_data.s = doc["sat"].as<float>();
        health_data.hr = doc["hr"].as<float>();
        TENSORFLOW_RUNNER::requestEvaluation(health_data);
        bool emergency = TENSORFLOW_RUNNER::heartAttackDetected() || doc["is_fall"].as<bool>();
        return "T|" + doc["d_id"].as<String>() + "|" + doc["w_id"].as<String>() + "|" +
               doc["a_id"].as<String>() + "|" + doc["hr"].as<String>() + "|" +
               doc["sat"].as<String>() + "|" + doc["temp"].as<String>() + "|" +
               String(emergency) + "|" + doc["p"].as<String>() + "|" + doc["rssi"].as<String>() + "|" +
                       doc["anchor_id"].as<String>();
    }

    /**
     * @brief Convert the LoRa tracking data message to a JSON message
     * @param data The LoRa tracking data encoded message
     * @return A JSON Document with the tracking data message
     */
    String convertLoRaToBLEJsonData(const String &data) {
        String output;
        JsonDocument doc;
        doc["device_id"] = getValueFromEncodedData(data, '|', 1);
        doc["worker_id"] = getValueFromEncodedData(data, '|', 2);
        doc["activity_id"] = getValueFromEncodedData(data, '|', 3);
        doc["heart_rate"] = getValueFromEncodedData(data, '|', 4);
        doc["saturation"] = getValueFromEncodedData(data, '|', 5);
        doc["temperature"] = getValueFromEncodedData(data, '|', 6);
        doc["emergency"] = getValueFromEncodedData(data, '|', 7);
        doc["communication_progressive"] = getValueFromEncodedData(data, '|', 8);
        doc["rssi"] = getValueFromEncodedData(data, '|', 9);
        doc["anchor_id"] = getValueFromEncodedData(data, '|', 10);
        serializeJson(doc, output);
        return output;
    }

    String getValueFromEncodedData(const String &data, char separator, int index) {
        int found = 0;
        int strIndex[] = {0, -1};
        int maxIndex = data.length() - 1;

        for (int i = 0; i <= maxIndex && found <= index; i++) {
            if (data.charAt(i) == separator || i == maxIndex) {
                found++;
                strIndex[0] = strIndex[1] + 1;
                strIndex[1] = (i == maxIndex) ? i + 1 : i;
            }
        }
        return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
    }

    void setUnreachableDevice(const NimBLEAddress &address) {
        for (device_descriptor &descriptor: GLOBALS::devices) {
            if (descriptor.device == address) {
                descriptor.unreachable = true;
                break;
            }
        }
    }

    void flushUnreachableDevices() {
        GLOBALS::devices.erase(
                std::remove_if(
                        GLOBALS::devices.begin(),
                        GLOBALS::devices.end(),
                        [](device_descriptor const &device) { return device.unreachable; }
                ),
                GLOBALS::devices.end()
        );
    }
}


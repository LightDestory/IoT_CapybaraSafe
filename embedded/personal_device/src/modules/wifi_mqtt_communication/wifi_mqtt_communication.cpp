#include "wifi_mqtt_communication.h"

namespace WIFI_MQTT_COM {

    WiFiClient *wifiClient;
    PubSubClient *mqttClient;
    bool isListening = false;

    /**
     * @brief Initializes the WiFi and MQTT connection
     * @return True if the connection was successful, false otherwise
     */
    bool initWifiMQTT() {
        wifiClient = new WiFiClient();
        mqttClient = new PubSubClient(*wifiClient);
        uint8_t timeout = 0;
        SERIAL_LOGGER::log("Connecting to WiFi");
        DISPLAY_ESP::drawCenteredImageTitleSubtitle(DISPLAY_IMAGES::radar, "Network", "Connecting...");
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        while (WiFi.status() != WL_CONNECTED) {
            delay(500);
            if (++timeout > CONNECTION_TIMEOUT) {
                return false;
            }
        }
        mqttClient->setServer(MQTT_HOST.c_str(), MQTT_PORT);
        mqttClient->setCallback(mqtt_pair_callback);
        String client_id = String(PERSISTENCE::getDeviceName()) + "_" + String(WiFi.macAddress());
        timeout = 0;
        SERIAL_LOGGER::log("Connecting to MQTT Broker");
        while (!mqttClient->connected()) {
            if (!mqttClient->connect(client_id.c_str(), MQTT_USER.c_str(), MQTT_PASSWORD.c_str())) {
                delay(500);
                if (++timeout > CONNECTION_TIMEOUT) {
                    return false;
                }
            }
        }
        mqttClient->subscribe(MQTT_PAIR_TOPIC.c_str());
        isListening = true;
        return true;
    }

    /**
     * @brief The callback function for the MQTT pairing topic
     * @param topic The topic of the message
     * @param payload The message payload
     * @param length The length of the payload
     */
    void mqtt_pair_callback(char *topic, byte *payload, unsigned int length) {
        payload[length] = 0;
        const String message = (char *) payload;
        analyzePairRequest(message);
    }

    /**
     * @brief Analyzes the MQTT Pair Request and acts accordingly
     * @param message The JSON string request to analyze
     */
    void analyzePairRequest(const String &message) {
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, message);
        if (error) {
            return;
        }
        deserializeJson(doc, message);
        if (doc.containsKey("type") && doc.containsKey("device_id") && doc.containsKey("worker_id")
            && doc.containsKey("activity_id")) {
            if (doc["type"].as<String>() == String("req") &&
                doc["device_id"].as<uint32_t>() == PERSISTENCE::preferences.getUInt("ID")) {
                GLOBALS::workerID = doc["worker_id"].as<uint32_t>();
                GLOBALS::activityID = doc["activity_id"].as<uint32_t>();
                GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::PAIR_COMPLETE;
                SERIAL_LOGGER::log(
                        String("Paired with: Worker-") + String(GLOBALS::workerID) + String(" Activity-") +
                        String(GLOBALS::activityID));
                doc["type"] = "ack";
                String serialized;
                serializeJson(doc, serialized);
                mqttClient->publish(MQTT_PAIR_TOPIC.c_str(), serialized.c_str());
                delay(1000);
                mqttClient->disconnect();
                WiFi.disconnect();
                delete mqttClient;
                delete wifiClient;
            }
        }
    }
}
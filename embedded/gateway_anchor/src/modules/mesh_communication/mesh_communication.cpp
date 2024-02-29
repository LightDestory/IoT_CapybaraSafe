#include "mesh_communication.h"

namespace MESH_COM {

    RH_RF95 rf95(LLG_CS, LLG_DI0);
    RHMesh *manager = nullptr;
    unsigned long nextTxTime = 0;

    /**
     * @brief Initializes the Mesh Communication
     * @return True if the initialization was successful, false otherwise
     */
    bool init() {
        SERIAL_LOGGER::log("Initializing Mesh Communication...");
        SPI.begin(LLG_SCK, LLG_MISO, LLG_MOSI, LLG_CS);
        manager = new RHMesh(rf95, uint8_t(PERSISTENCE::preferences.getUInt("ID")));
        if (!manager->init()) {
            return false;
        }
        rf95.setTxPower(10, false);
        rf95.setFrequency(868.0);
        rf95.setCADTimeout(500);

        if (!rf95.setModemConfig(RH_RF95::Bw125Cr45Sf128)) {
            return false;
        }
        nextTxTime = millis();
        return true;
    }

    uint32_t elaborateQueue() {
        nextTxTime += SEND_INTERVAL;
        uint32_t counter = 0;
        JsonDocument doc;
        bool isGateway = PERSISTENCE::isGateway(); // Calling it once to avoid multiple calls
        while (!GLOBALS::messages_queue.empty()) {
            String message = GLOBALS::messages_queue.front();
            SERIAL_LOGGER::log("Elaborating message: " + message);
            uint8_t dataBytes[message.length()];
            message.getBytes(dataBytes, message.length());
            if (message[0] == 'T') {
                SERIAL_LOGGER::log("Handling Tracking...");
                if (isGateway) {
                    SERIAL_LOGGER::log("Sending to tracking system...");
                    WIFI_MQTT_COM::writeOnTopic(WIFI_MQTT_COM::MQTT_TRACK_TOPIC,
                                                DATA_STRUCTURES::convertLoRaToBLEJsonData(message));
                } else {
                    SERIAL_LOGGER::log("Sending to Gateways...");
                    manager->sendtoWait(dataBytes, sizeof(dataBytes), 1);
                    delay(200);
                    manager->sendtoWait(dataBytes, sizeof(dataBytes), 254);
                    delay(200);
                }
            } else if (message[0] == 'A') {
                SERIAL_LOGGER::log("Handling Alert...");
                uint8_t hop = uint8_t(DATA_STRUCTURES::getValueFromEncodedData(message, '|', 3).toInt());
                if (isGateway) {
                    if (hop == 0) {
                        manager->sendtoWait(dataBytes, sizeof(dataBytes), 255);
                    }
                } else {
                    if (hop < MAX_HOP) {
                        doc.clear();
                        doc = DATA_STRUCTURES::convertLoraAlertToJSON(message);
                        doc["hop"] = hop + 1;
                        DATA_STRUCTURES::convertMqttAlertToLoRa(doc).getBytes(dataBytes, message.length());
                        manager->sendtoWait(dataBytes, sizeof(dataBytes), 255);
                        delay(200);
                    }
                }
                BLE_COM::notifyAlert((int16_t) DATA_STRUCTURES::getValueFromEncodedData(message, '|', 1).toInt(),
                                     DATA_STRUCTURES::getValueFromEncodedData(message, '|', 2));
            }
            counter++;
            GLOBALS::messages_queue.erase(GLOBALS::messages_queue.begin());
        }
        return counter;
    }

    /**
     * @brief Receives and forwards the messages
     */
    void receiveAndForward() {
        uint8_t buf[RH_MESH_MAX_MESSAGE_LEN];
        uint8_t len = sizeof(buf);
        uint8_t from;
        if (manager->recvfromAckTimeout(buf, &len, RECEIVE_TIMEOUT, &from)) {
            String data = (char *) buf;
            if (data[0] == 'A') {
                GLOBALS::messages_queue.push_back(data);
            } else if (data[0] == 'T') {
                if (PERSISTENCE::isGateway()) {
                    WIFI_MQTT_COM::writeOnTopic(WIFI_MQTT_COM::MQTT_TRACK_TOPIC,
                                                DATA_STRUCTURES::convertLoRaToBLEJsonData(data));
                }
            }
        }
    }

    /**
     * @brief The main loop for the Mesh Communication
     * @param argv the argument vector
     */
    void mesh_loop(void *argv) {
        while (true) {
            if (millis() > nextTxTime) {
                if (!GLOBALS::messages_queue.empty()) {
                    SERIAL_LOGGER::log("Elaborating queue...");
                    uint32_t messages_handled = elaborateQueue();
                    SERIAL_LOGGER::log("Messages handled: " + String(messages_handled));
                }
            }
            receiveAndForward();
            delay(200);
        }
    }
}
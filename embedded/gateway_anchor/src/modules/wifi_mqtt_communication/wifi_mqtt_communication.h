#ifndef WIFI_MQTT_COMMUNICATION_H
#define WIFI_MQTT_COMMUNICATION_H

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "../persistence/persistence.h"
#include "../utils/serial_logger/serial_logger.h"
#include "../utils/globals.h"
#include "../display/display.h"
#include "../display/images.h"
#include "../data_structures/data_structures.h"

namespace WIFI_MQTT_COM {

    extern WiFiClient *wifiClient;
    extern PubSubClient *mqttClient;

    // MQTT Credentials
    const String MQTT_HOST = "DOMAIN";
    const String MQTT_USER = "USER";
    const String MQTT_PASSWORD = "PASSWORD";
    const uint16_t MQTT_PORT = 1883;
    const String MQTT_ALERT_TOPIC = "broker/alert_system";
    const String MQTT_TRACK_TOPIC = "broker/tracking_system";
    // WiFi Credentials
    const String WIFI_SSID = "NETWORK_NAME";
    const String WIFI_PASSWORD = "PASSWORD";
    // General Timeout
    const uint8_t CONNECTION_TIMEOUT = 30;


    extern bool isListening;

    void mqtt_pair_callback(char *topic, byte *payload, unsigned int length);

    void analyzePairRequest(const String &message);

    bool initWifiMQTT();

    void writeOnTopic(const String &topic, const String &message);
}

#endif //WIFI_MQTT_COMMUNICATION_H

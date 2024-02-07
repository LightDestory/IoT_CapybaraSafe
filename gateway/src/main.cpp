#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/pin_configuration.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include <WiFi.h>
//#include <PubSubClient.h>
#include <MQTTClient.h>
#include "esp_random.h"

// WiFi
const char *ssid = "TIM-30649392";                 // Enter your WiFi name
const char *password = "kNhfdZZ7XHHtax5qtKURxSAy"; // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "mqttserver.lightdestory.com";
const char *topic = "testing/gateway";
const char *mqtt_username = "iotproject";
const char *mqtt_password = "iotproject";
const int mqtt_port = 1883;

WiFiClient espClient;
MQTTClient  client;

uint8_t interrupt_watcher = 0;

void callback(String &topic, String &payload)
{
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    Serial.print(payload);
    Serial.println();
    Serial.println("-----------------------");
}

/*
 * This function is used to check if the current executed program should be interrupted and reset to the main menu.
 * The interrupt is triggered by a long press of BUTTON_1.
 */
void checkProgramInterrupt()
{
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == HIGH && interrupt_watcher != 0)
    {
        interrupt_watcher = 0;
        return;
    }
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == LOW)
    {
        if (++interrupt_watcher == 10)
        {
            interrupt_watcher = 0;
            // GLOBALS::interrupt_flag = true;
            PIN_CONFIGURATION::resetOutputs();
            SERIAL_LOGGER::log("InterruptTriggered");
            return;
        }
    }
}

void setup()
{
    Serial.begin(115200);
    SERIAL_LOGGER::log("Booting...");
    if (!DISPLAY_ESP::display_hw.init())
    {
        SERIAL_LOGGER::log("Failed to initialize display!");
        while (true)
        {
        }
    }
    DISPLAY_ESP::showBootAnimation();
    PIN_CONFIGURATION::initPinMode();
    DISPLAY_ESP::updateBootAnimationProgressBar(25);
    delay(150);
    PIN_CONFIGURATION::resetOutputs();
    delay(150);
    DISPLAY_ESP::updateBootAnimationProgressBar(100);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the Wi-Fi network");
    // connecting to a mqtt broker
    String client_id = "gateway_" + String(WiFi.macAddress());
    client.begin(mqtt_broker, mqtt_port, espClient);
    client.onMessage(callback);
    while (!client.connected())
    {
        Serial.printf("The client %s tries to connect to the public MQTT broker\n", client_id.c_str());
        client.connect(client_id.c_str(), mqtt_username, mqtt_password);
    }
    Serial.print("Connected");
    // Publish and subscribe
    String message = "Hi, I am " + client_id;
    client.publish(topic, message.c_str());
    client.subscribe(topic);
    client.subscribe("testing/alert");
}

void loop()
{
    checkProgramInterrupt();
    client.loop();
    delay(500);
}
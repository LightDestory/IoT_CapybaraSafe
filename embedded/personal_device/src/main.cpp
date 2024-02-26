#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/display/images.h"
#include "modules/pin_configuration.h"
#include "modules/led_controls/led_controls.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "modules/machine_learning/tensorflow_runner.h"
#include "modules/persistence/persistence.h"
#include "modules/ble_communication/ble_communication.h"
#include "modules/wifi_mqtt_communication/wifi_mqtt_communication.h"


TaskHandle_t InterruptCheckerTask;

/**
 * @brief Perform a hard reset by clearing the preferences and rebooting the device
 */
void doHardReset() {
    PERSISTENCE::preferences.clear();
    LED_CONTROLS::turnOffLeds();
    LED_CONTROLS::toggleLed(PIN_CONFIGURATION::GREEN_LED);
    DISPLAY_ESP::drawCenteredTitleSubtitle("Hard Reset", "Rebooting in 5s");
    delay(5000);
    ESP.restart();
}

/**
 * @brief Check if the interrupt is triggered by checking the button states and time
 * HARD RESET: If both buttons are pressed for 12 seconds, the device will be reset
 */
void checkInterrupt(void *argv) {
    while (true) {
        if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == HIGH &&
            digitalRead(PIN_CONFIGURATION::BUTTON_2) == HIGH &&
            GLOBALS::interrupt_counter != 0) {
            GLOBALS::interrupt_counter = 0;
        } else if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == LOW && digitalRead(PIN_CONFIGURATION::BUTTON_2) == LOW) {
            if (++GLOBALS::interrupt_counter == 25) {
                GLOBALS::currentInterrupt = GLOBALS::INTERRUPT_TYPES::HARD_RESET;
            }
        }
        delay(500);
    }
}

/**
 * @brief Initialize the tech stacks such as Display, BLE, Persistence, etc.
 */
void initTechStacks() {
    if (!DISPLAY_ESP::display_hw.init()) {
        SERIAL_LOGGER::log("Failed to initialize display!");
        while (true) {
            delay(500);
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
        }
    }
    DISPLAY_ESP::showBootAnimation();
    PIN_CONFIGURATION::initPinMode();
    DISPLAY_ESP::updateBootAnimationProgressBar(20);
    delay(50);
    PIN_CONFIGURATION::resetOutputs();
    DISPLAY_ESP::updateBootAnimationProgressBar(40);
    delay(50);
    PERSISTENCE::init();
    DISPLAY_ESP::updateBootAnimationProgressBar(60);
    delay(50);
    if (!TENSORFLOW_RUNNER::initModel()) {
        while (true) {
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail ML model!", 900);
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(80);
    delay(50);
    if (!BLE_COM::initBLEStack()) {
        while (true) {
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail BLE stack!", 900);
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(100);
}

/**
 * @brief Main entry point of the microcontroller
 */
void setup() {
    Serial.begin(115200);
    SERIAL_LOGGER::log("Booting...");
    initTechStacks();
    // Setting up the interrupt checker task
    xTaskCreatePinnedToCore(
            checkInterrupt,
            "InterruptChecker",
            10000,
            NULL,
            1,
            &InterruptCheckerTask,
            0);
}

/**
 * @brief Looper function that runs the state machine
 * The state machine is responsible for the following:
 * 1. Check if the interrupt is triggered
 * 2. Check the current state and perform the necessary actions
 */
void loop() {
    Serial.println("Free memory: " + String(esp_get_free_heap_size()) + " bytes");
    if (GLOBALS::currentInterrupt == GLOBALS::INTERRUPT_TYPES::HARD_RESET) {
        doHardReset();
    }
    switch (GLOBALS::mainLoopState) {
        case GLOBALS::RUNTIME_STATE::REQUEST_SETUP:
            if (!BLE_COM::isBLEServing) {
                if (!BLE_COM::initBLEService(BLE_COM::SERVICE_TYPE::SETUP_SERVICE)) {
                    while (true) {
                        LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
                        DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail BLE Service!", 900);
                    }
                }
            }
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::BLUE_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::bluetooth, "Perform CONFIG", 900);
            break;
        case GLOBALS::RUNTIME_STATE::SETUP_COMPLETE:
            LED_CONTROLS::turnOffLeds();
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::GREEN_LED);
            DISPLAY_ESP::drawCenteredTitleSubtitle("SUCCESS", "Rebooting in 5s");
            delay(5000);
            ESP.restart();
            break;
        case GLOBALS::RUNTIME_STATE::REQUEST_PAIR:
            if (!WIFI_MQTT_COM::isListening) {
                if (!WIFI_MQTT_COM::initWifiMQTT()) {
                    while (true) {
                        LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
                        DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail WIFI-MQTT!", 900);
                    }
                }
            }
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::BLUE_LED);
            WIFI_MQTT_COM::mqttClient->loop();
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::radar, "Perform PAIRING", 900);
            break;
        case GLOBALS::RUNTIME_STATE::PAIR_COMPLETE:
            LED_CONTROLS::turnOffLeds();
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::radar, "PAIRED", 900);
            break;
        default: // Missing Config
            const uint32_t ID = PERSISTENCE::preferences.getUInt("ID");
            SERIAL_LOGGER::log(String("Hello from: ") + PERSISTENCE::getDeviceName());
            GLOBALS::mainLoopState =
                    ID != 0 ? GLOBALS::RUNTIME_STATE::REQUEST_PAIR : GLOBALS::RUNTIME_STATE::REQUEST_SETUP;
            break;
    }
    delay(500);
}
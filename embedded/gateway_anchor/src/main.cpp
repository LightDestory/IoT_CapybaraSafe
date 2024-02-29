#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/display/images.h"
#include "modules/pin_configuration.h"
#include "modules/persistence/persistence.h"
#include "modules/led_controls/led_controls.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "modules/machine_learning/tensorflow_runner.h"
#include "modules/ble_communication/ble_communication.h"
#include "modules/wifi_mqtt_communication/wifi_mqtt_communication.h"
#include "modules/mesh_communication/mesh_communication.h"


TaskHandle_t InterruptCheckerTask;
TaskHandle_t meshThread;

/**
 * @brief Perform a hard reset by clearing the preferences and rebooting the device
 */
void doHardReset() {
    SERIAL_LOGGER::log("Hard reset triggered!");
    PERSISTENCE::preferences.clear();
    LED_CONTROLS::turnOffLeds();
    LED_CONTROLS::toggleLed(PIN_CONFIGURATION::GREEN_LED);
    DISPLAY_ESP::drawCenteredTitleSubtitle("Hard Reset", "Rebooting in 5s");
    delay(5000);
    ESP.restart();
}

/**
 * @brief Check if the hard reset interrupt is triggered
 * HARD RESET: If both buttons are pressed for 12 seconds, the device will be reset
 */
void checkHardResetInterrupt() {
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == HIGH &&
        digitalRead(PIN_CONFIGURATION::BUTTON_2) == HIGH &&
        GLOBALS::hardResetInterruptCounter != 0) {
        GLOBALS::hardResetInterruptCounter = 0;
    } else if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == LOW && digitalRead(PIN_CONFIGURATION::BUTTON_2) == LOW) {
        if (++GLOBALS::hardResetInterruptCounter == 6) {
            GLOBALS::hardResetInterrupt = true;
        }
    }
}

/**
 * @brief Check any interrupt that is triggered
 */
void checkInterrupt(void *argv) {
    while (true) {
        checkHardResetInterrupt();
        delay(200);
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
        SERIAL_LOGGER::log("Failed to initialize ML model!");
        while (true) {
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail ML model!", "", 900);
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(75);
    delay(50);
    if (!BLE_COM::initBLEStack()) {
        SERIAL_LOGGER::log("Failed to initialize BLE stack!");
        while (true) {
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail BLE stack!", "", 900);
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(95);
    delay(50);
    if (!MESH_COM::init()) {
        SERIAL_LOGGER::log("Failed to initialize LoRa stack!");
        while (true) {
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail LoRa stack!", "", 900);
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
    xTaskCreatePinnedToCore(
            MESH_COM::mesh_loop,
            "meshThread",
            10000,
            NULL,
            1,
            &meshThread,
            0);
}

/**
 * @brief Looper function that runs the state machine
 * The state machine is responsible for the following:
 * 1. Check if the interrupt is triggered
 * 2. Check the current state and perform the necessary actions
 */
void loop() {
    if (GLOBALS::hardResetInterrupt) {
        doHardReset();
    }
    switch (GLOBALS::mainLoopState) {
        case GLOBALS::RUNTIME_STATE::REQUEST_SETUP:
            if (!BLE_COM::isBLEServing) {
                if (!BLE_COM::initBLEService()) {
                    SERIAL_LOGGER::log("Failed to initialize BLE service!");
                    while (true) {
                        LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
                        DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail BLE Service!", "", 900);
                    }
                }
            }
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::BLUE_LED);
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::bluetooth, "Perform CONFIG",
                                           "Device name: " + PERSISTENCE::getDeviceName(), 900);
            break;
        case GLOBALS::RUNTIME_STATE::SETUP_COMPLETE:
            LED_CONTROLS::turnOffLeds();
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::GREEN_LED);
            DISPLAY_ESP::drawCenteredTitleSubtitle("SUCCESS", "Rebooting in 5s");
            delay(5000);
            ESP.restart();
            break;
        case GLOBALS::RUNTIME_STATE::MQTT_SETUP:
            if (!WIFI_MQTT_COM::isListening) {
                if (!WIFI_MQTT_COM::initWifiMQTT()) {
                    SERIAL_LOGGER::log("Failed to initialize WIFI-MQTT!");
                    while (true) {
                        LED_CONTROLS::toggleLed(PIN_CONFIGURATION::RED_LED);
                        DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail WIFI-MQTT!", "", 900);
                        if (GLOBALS::hardResetInterrupt) {
                            doHardReset();
                        }
                    }
                }
            }
            GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::RUNNING;
            break;
        case GLOBALS::RUNTIME_STATE::RUNNING:
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::GREEN_LED);
            DISPLAY_ESP::drawCenteredImageTitleSubtitle(DISPLAY_IMAGES::radar, "LISTENING");
            if (PERSISTENCE::isGateway()) {
                WIFI_MQTT_COM::mqttClient->loop();
            }
            BLE_COM::fetch_loop();
            break;
        default: // Missing Config
            const uint32_t ID = PERSISTENCE::preferences.getUInt("ID");
            SERIAL_LOGGER::log(String("Hello from: ") + PERSISTENCE::getDeviceName());
            switch (ID) {
                case 0: // Missing config
                    GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::REQUEST_SETUP;
                    break;
                case 1:
                case 254:
                    GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::MQTT_SETUP;
                    break;
                default:
                    GLOBALS::mainLoopState = GLOBALS::RUNTIME_STATE::RUNNING;
                    break;
            }
    }
    delay(250);
}
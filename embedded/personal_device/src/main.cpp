#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/display/images.h"
#include "modules/pin_configuration.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "modules/machine_learning/tensorflow_runner.h"
#include "modules/persistence/persistence.h"
#include "modules/ble_communication/ble_communication.h"

/**
 * @brief Check if the interrupt is triggered by checking the button states and time
 * HARD RESET: If both buttons are pressed for 5 seconds, the device will be reset
 */
void checkInterrupt() {
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == HIGH &&
            digitalRead(PIN_CONFIGURATION::BUTTON_2) == HIGH &&
            GLOBALS::interrupt_counter != 0) {
        GLOBALS::interrupt_counter = 0;
        return;
    }
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == LOW && digitalRead(PIN_CONFIGURATION::BUTTON_2) == LOW) {
        if (++GLOBALS::interrupt_counter == 10) {
            PERSISTENCE::preferences.clear();
            DISPLAY_ESP::drawCenteredTitleSubtitle("Hard Reset", "Rebooting in 5s");
            delay(5000);
            ESP.restart();
            return;
        }
    }
}

/**
 * @brief Initialize the tech stacks such as Display, BLE, Persistence, etc.
 */
void initTechStacks() {
    if (!DISPLAY_ESP::display_hw.init())
    {
        SERIAL_LOGGER::log("Failed to initialize display!");
        while (true) {}
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
    if (!TENSORFLOW_RUNNER::initModel())
    {
        while (true){
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail ML model!", 900);
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(80);
    delay(50);
    if (!BLE_COM::initBLE()) {
        while (true){
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail BLE stack!", 900);
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(100);
}

/**
 * @brief Main entry point of the microcontroller
 */
void setup()
{
    Serial.begin(115200);
    SERIAL_LOGGER::log("Booting...");
    initTechStacks();
}

/**
 * @brief Looper function that runs the state machine
 * The state machine is responsible for the following:
 * 1. Check if the interrupt is triggered
 * 2. Check the current state and perform the necessary actions
 */
void loop()
{
    checkInterrupt();
    switch (GLOBALS::mainLoopState) {
        case GLOBALS::RUNTIME_STATE::REQUEST_SETUP:
            if (!BLE_COM::isBLEServing) {
                if (!BLE_COM::initSetupService()) {
                    while (true) {
                        DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::error, "InitFail BLE Service!", 900);
                    }
                }
            }
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::bluetooth, "Perform CONFIG", 900);
            break;
        case GLOBALS::RUNTIME_STATE::REQUEST_PAIR:
            DISPLAY_ESP::blinkImageMessage(DISPLAY_IMAGES::radar, "Perform PAIRING", 900);
            break;
        case GLOBALS::RUNTIME_STATE::SETUP_COMPLETE:
            DISPLAY_ESP::drawCenteredTitleSubtitle("SUCCESS", "Rebooting in 5s");
            delay(5000);
            ESP.restart();
            break;
        default: // Missing Config
            const uint32_t ID = PERSISTENCE::preferences.getUInt("ID");
            GLOBALS::mainLoopState = ID != 0 ? GLOBALS::RUNTIME_STATE::REQUEST_PAIR : GLOBALS::RUNTIME_STATE::REQUEST_SETUP;
            break;
    }
    delay(500);
}
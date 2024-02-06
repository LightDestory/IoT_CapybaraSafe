#include <Arduino.h>
#include "pin_configuration.h"
#include "modules/utils/serial_logger/serial_logger.h"

void PIN_CONFIGURATION::initPinMode() {
    SERIAL_LOGGER::log("Initializing Pin Mode");
    pinMode(RED_LED, OUTPUT);
    pinMode(GREEN_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    pinMode(BLUE_LED, OUTPUT);
    pinMode(WHITE_LED, OUTPUT);
    pinMode(BUTTON_1, INPUT_PULLUP);
    pinMode(BUTTON_2, INPUT_PULLUP);
}

void PIN_CONFIGURATION::resetOutputs() {
    SERIAL_LOGGER::log("Resetting Output Pins to LOW");
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(BLUE_LED, LOW);
    digitalWrite(WHITE_LED, LOW);
}
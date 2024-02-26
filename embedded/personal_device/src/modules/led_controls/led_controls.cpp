#include "led_controls.h"

namespace LED_CONTROLS {
    void toggleLed(const uint8_t pin) {
        digitalWrite(pin, !digitalRead(pin));
    }

    void turnOffLeds() {
        PIN_CONFIGURATION::resetOutputs(false);
    }
}
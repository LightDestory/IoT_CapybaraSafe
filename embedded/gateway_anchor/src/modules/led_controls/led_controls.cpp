#include "led_controls.h"

namespace LED_CONTROLS {
    /**
     * @brief Toggles the state of the LED
     * @param pin The pin number of the LED
     */
    void toggleLed(const uint8_t pin) {
        digitalWrite(pin, !digitalRead(pin));
    }

    /**
     * @brief Turns off all LEDs
     */
    void turnOffLeds() {
        PIN_CONFIGURATION::resetOutputs(false);
    }

    /**
     * @brief Turns off the LED
     * @param pin The pin number of the LED
     */
    void turnOffLed(const uint8_t pin) {
        digitalWrite(pin, LOW);
    }
}
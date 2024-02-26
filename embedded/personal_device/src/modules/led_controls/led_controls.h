#ifndef LED_CONTROLS_H
#define LED_CONTROLS_H

#include <Arduino.h>
#include "../pin_configuration.h"

namespace LED_CONTROLS {

    void toggleLed(const uint8_t pin);

    void turnOffLeds();
}

#endif //LED_CONTROLS_H
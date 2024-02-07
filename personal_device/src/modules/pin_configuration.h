#ifndef PINOUT_H_
#define PINOUT_H_

#include <Arduino.h>

namespace PIN_CONFIGURATION {
    // LED
    const uint8_t RED_LED = 3;
    const uint8_t GREEN_LED = 0;
    const uint8_t YELLOW_LED = 4;
    const uint8_t BLUE_LED = 2;
    const uint8_t WHITE_LED = 15;

    // BUTTONS
    const uint8_t BUTTON_1 = 14;
    const uint8_t BUTTON_2 = 12;

    // DISPLAY
    const uint8_t DISPLAY_SDA = 21;
    const uint8_t DISPLAY_SCL = 22;

    // Functions
    /*
     * This function is used to initialize the pin mode for all the pins used in the project.
     */
    void initPinMode();

    /*
    * This function is used to reset all the outputs to LOW.
    */
    void resetOutputs();
}
#endif
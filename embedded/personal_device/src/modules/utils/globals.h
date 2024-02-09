#ifndef IOT_ESP32_FIRMWARE_GLOBALS_H
#define IOT_ESP32_FIRMWARE_GLOBALS_H

#include <Arduino.h>

namespace GLOBALS {
    extern bool interrupt_flag;
    enum SUB_ROUTINE_STATE {
        UN_SETUP, FAILED_INIT, READY, LOOPING, STATIC
    };
}

#endif //IOT_ESP32_FIRMWARE_GLOBALS_H

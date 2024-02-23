#ifndef IOT_ESP32_FIRMWARE_GLOBALS_H
#define IOT_ESP32_FIRMWARE_GLOBALS_H

#include <Arduino.h>

namespace GLOBALS {

    enum RUNTIME_STATE {
        MISSING_CONFIG, REQUEST_SETUP, SETUP_COMPLETE, REQUEST_PAIR, INITIALIZING, RUNNING, STOPPED
    };

    extern enum RUNTIME_STATE mainLoopState;
    extern uint8_t interrupt_counter;


    const String PREFERENCE_NAMESPACE = "ATMR-IOT-2024";
    const String DEVICE_NAME = "PD_";
}

#endif //IOT_ESP32_FIRMWARE_GLOBALS_H

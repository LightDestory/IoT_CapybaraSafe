#ifndef GLOBALS_H
#define GLOBALS_H

#include <Arduino.h>

namespace GLOBALS {

    /**
     * @brief The runtime state of the main loop
     * 1. MISSING_CONFIG: The device is missing the ID
     * 2. REQUEST_SETUP: The device is waiting for the user to setup the device
     * 3. SETUP_COMPLETE: The device has been setup and is ready to pair
     * 4. REQUEST_PAIR: The device is waiting for the user to pair the device
     */
    enum RUNTIME_STATE {
        MISSING_CONFIG, REQUEST_SETUP, SETUP_COMPLETE, REQUEST_PAIR, PAIR_COMPLETE, INIT_TRACKING, TRACKING
    };

    extern enum RUNTIME_STATE mainLoopState;
    extern uint8_t hardResetInterruptCounter;
    extern bool hardResetInterrupt;
    extern uint8_t fakeBadDataInterruptCounter;
    extern bool fakeBadDataInterrupt;
    extern uint32_t workerID;
    extern uint32_t activityID;
    const String DEVICE_NAME = "PD_";
}

#endif //GLOBALS_H

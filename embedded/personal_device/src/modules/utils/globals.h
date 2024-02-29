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
     * 5. PAIR_COMPLETE: The device has been paired and is ready to start tracking
     * 6. INIT_TRACKING: The device is initializing the tracking service
     * 7. ON_ALERT: The device is on alert
     * 8. TRACKING: The device is tracking by updating the tracking data
     */
    enum RUNTIME_STATE {
        MISSING_CONFIG, REQUEST_SETUP, SETUP_COMPLETE, REQUEST_PAIR, PAIR_COMPLETE, INIT_TRACKING, ON_ALERT, TRACKING
    };

    extern enum RUNTIME_STATE mainLoopState;
    extern uint8_t hardResetInterruptCounter;
    extern bool hardResetInterrupt;
    extern uint8_t fakeBadDataInterruptCounter;
    extern bool fakeBadDataInterrupt;
    extern uint8_t dismissAlertInterruptCounter;
    extern String alertMessage;
    extern uint32_t workerID;
    extern uint32_t activityID;
    const String DEVICE_NAME = "PD_";
}

#endif //GLOBALS_H

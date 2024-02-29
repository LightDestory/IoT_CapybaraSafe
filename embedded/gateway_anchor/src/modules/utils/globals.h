#ifndef GLOBALS_H
#define GLOBALS_H

#include <Arduino.h>
#include <queue>
#include "../data_structures/data_structures.h"

namespace GLOBALS {

    /**
     * @brief The runtime state of the main loop
     * 1. MISSING_CONFIG: The device is missing the ID
     * 2. REQUEST_SETUP: The device is waiting for the user to setup the device
     * 3. SETUP_COMPLETE: The device has been setup and is ready to pair
     * 4. MQTT_SETUP: If the device is a gateway it setups up the MQTT connection
     * 5. RUNNING: The device is running and listening for BLE and MQTT messages
     */
    enum RUNTIME_STATE {
        MISSING_CONFIG, REQUEST_SETUP, SETUP_COMPLETE, MQTT_SETUP, RUNNING
    };

    extern enum RUNTIME_STATE mainLoopState;
    extern uint8_t hardResetInterruptCounter;
    extern bool hardResetInterrupt;
    const String DEVICE_NAME = "ANC_";
    extern std::vector<String> messages_queue;
    extern std::vector<DATA_STRUCTURES::device_descriptor> devices;
}

#endif //GLOBALS_H

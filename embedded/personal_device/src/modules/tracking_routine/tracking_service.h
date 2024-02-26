#ifndef TRACKING_SERVICE_H
#define TRACKING_SERVICE_H

#include <Arduino.h>
#include "../persistence/persistence.h"
#include "../sensor_faker/sensor_faker_provider.h"
#include "../machine_learning/tensorflow_runner.h"
#include "../utils/globals.h"
#include <ArduinoJson.h>

namespace TRACKING_SERVICE {

    // Data structure to hold the tracking data
    typedef struct tracking_data {
        uint32_t d_id; // Device ID
        uint32_t w_id; // Worker ID
        uint32_t a_id; // Activity ID
        uint16_t hr; // Heart rate
        uint8_t sat; // Saturation
        float temp; // Temperature
        bool is_fall; // Is fall detected
        uint32_t p; // Progressive number
    } tracking_data;

    extern uint32_t current_progressive_number;
    extern tracking_data current_tracking_data;
    extern bool isDataInitialized;

    void initTrackingData();

    void updateTrackingData();

    String serializedData();

}

#endif //TRACKING_SERVICE_H

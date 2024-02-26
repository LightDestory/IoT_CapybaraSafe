#include "tracking_service.h"

namespace TRACKING_SERVICE {
    bool isDataInitialized = false;
    uint32_t current_progressive_number = 0;
    tracking_data current_tracking_data = {};

    void initTrackingData() {
        current_tracking_data.d_id = PERSISTENCE::preferences.getUInt("ID");
        current_tracking_data.w_id = GLOBALS::workerID;
        current_tracking_data.a_id = GLOBALS::activityID;
    }

    void updateTrackingData() {
        if (!isDataInitialized) {
            initTrackingData();
            isDataInitialized = true;
        }
        const SENSOR_FAKER::sensor_data newest_data = SENSOR_FAKER::get_sensor_data();
        TENSORFLOW_RUNNER::requestEvaluation(newest_data.fall_data);
        current_tracking_data.hr = newest_data.heart_data.hr;
        current_tracking_data.sat = newest_data.heart_data.s;
        current_tracking_data.temp = newest_data.heart_data.t;
        current_tracking_data.is_fall = TENSORFLOW_RUNNER::fallDetected();
        current_tracking_data.p = ++current_progressive_number;
    }

    String serializedData() {
        String output;
        JsonDocument doc;
        doc["d_id"] = current_tracking_data.d_id;
        doc["w_id"] = current_tracking_data.w_id;
        doc["a_id"] = current_tracking_data.a_id;
        doc["hr"] = current_tracking_data.hr;
        doc["sat"] = current_tracking_data.sat;
        doc["temp"] = current_tracking_data.temp;
        doc["is_fall"] = current_tracking_data.is_fall;
        doc["p"] = current_tracking_data.p;
        serializeJson(doc, output);
        return output;
    }
}

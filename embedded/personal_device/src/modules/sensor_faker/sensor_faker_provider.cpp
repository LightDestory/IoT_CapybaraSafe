#include "sensor_faker_provider.h"

namespace SENSOR_FAKER {

    fall_sensor_data get_fall_good_record() {
        return fall_good_records[esp_random() % 5];
    }

    fall_sensor_data get_fall_bad_record() {
        return fall_bad_records[esp_random() % 5];
    }

    heart_sensor_data get_heart_good_record() {
        return heart_good_records[esp_random() % 5];
    }

    heart_sensor_data get_heart_bad_record() {
        return heart_bad_records[esp_random() % 5];
    }

    sensor_data get_sensor_data() {
        sensor_data data;
        data.fall_data = get_fall_good_record();
        data.heart_data = get_heart_good_record();
        if (GLOBALS::fakeBadDataInterrupt) {
            LED_CONTROLS::toggleLed(PIN_CONFIGURATION::YELLOW_LED);
            GLOBALS::fakeBadDataInterrupt = false;
            uint8_t random = esp_random() % 2;
            if (random == 0) {
                data.fall_data = get_fall_bad_record();
            } else {
                data.heart_data = get_heart_bad_record();
            }
        }
        return data;
    }
}

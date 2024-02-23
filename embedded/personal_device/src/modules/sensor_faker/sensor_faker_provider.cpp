#include "sensor_faker_provider.h"
#include <ArduinoJson.h>

namespace SENSOR_FAKER {
    fall_sensor_data get_fall_good_record() {
        return fall_good_records[esp_random() % 5];
    }

    fall_sensor_data get_fall_bad_record() {
        return fall_bad_records[esp_random() % 5];
    }

    String serializeJSON(fall_sensor_data data) {
        String output;
        JsonDocument doc;
        doc["linear_max"] = data.l_m;
        doc["acc_skewness"] = data.a_s;
        doc["gyro_skewness"] = data.g_s;
        doc["post_gyro_max"] = data.p_g_m;
        doc["post_lin_max"] = data.p_l_m;
        serializeJson(doc, output);
        return output;
    }

    fall_sensor_data* deserializeJSON(String json) {
        fall_sensor_data *data;
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, json);
        if (error) {
            return nullptr;
        }
        deserializeJson(doc, json);
        data = new fall_sensor_data();
        data->l_m = doc["l_m"];
        data->a_s = doc["a_s"];
        data->g_s = doc["g_s"];
        data->p_g_m = doc["p_g_m"];
        data->p_l_m = doc["p_l_m"];
        return data;
    }
}

#include "tensorflow_runner.h"


namespace TENSORFLOW_RUNNER {
    Eloquent::TinyML::TfLite<FALL_DETECTION_MODEL::NUMBER_OF_INPUTS, FALL_DETECTION_MODEL::NUMBER_OF_OUTPUTS, FALL_DETECTION_MODEL::TENSOR_ARENA_SIZE> predictor;
    float latestPrediction[2];

    /**
     * @brief Initializes the machine learning model
     * @return True if the model was successfully loaded, false otherwise
     */
    bool initModel() {
        SERIAL_LOGGER::log("Loading machine learning model...");
        if (!predictor.begin(FALL_DETECTION_MODEL::FALL_DETECTION_MODEL_ARRAY)) {
            SERIAL_LOGGER::log("Failed to load model!");
            return false;
        }
        return true;
    }

    /**
     * @brief Requests the evaluation of the machine learning model
     * @param sensor_data The sensor data to be evaluated
     */
    void requestEvaluation(const SENSOR_FAKER::fall_sensor_data sensor_data) {
        float input[5] = {sensor_data.l_m, sensor_data.a_s, sensor_data.g_s, sensor_data.p_g_m, sensor_data.p_l_m};
        predictor.predict(input, latestPrediction);
    }

    /**
     * @brief Checks if a fall was detected
     * @return True if a fall was detected, false otherwise
     */
    bool fallDetected() {
        return latestPrediction[0] > latestPrediction[1];
    }
}
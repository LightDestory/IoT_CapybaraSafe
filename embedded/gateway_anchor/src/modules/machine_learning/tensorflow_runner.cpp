#include "tensorflow_runner.h"


namespace TENSORFLOW_RUNNER {
    Eloquent::TinyML::TfLite<HEART_FAILTURE_MODEL::NUMBER_OF_INPUTS, HEART_FAILTURE_MODEL::NUMBER_OF_OUTPUTS, HEART_FAILTURE_MODEL::TENSOR_ARENA_SIZE> predictor;
    float latestPrediction[2];

    /**
     * @brief Initializes the machine learning model
     * @return True if the model was successfully loaded, false otherwise
     */
    bool initModel() {
        SERIAL_LOGGER::log("Loading machine learning model...");
        if (!predictor.begin(HEART_FAILTURE_MODEL::HEART_FAILTURE_MODEL_ARRAY)) {
            SERIAL_LOGGER::log("Failed to load model!");
            return false;
        }
        return true;
    }

    /**
     * @brief Requests the evaluation of the machine learning model
     * @param sensor_data The sensor data to be evaluated
     */
    void requestEvaluation(const DATA_STRUCTURES::heart_sensor_data sensor_data) {
        float input[3] = {sensor_data.t, sensor_data.s, sensor_data.hr};
        predictor.predict(input, latestPrediction);
    }

    /**
     * @brief Checks if a heart attack was detected
     * @return True if a heart attack was detected, false otherwise
     */
    bool heartAttackDetected() {
        return latestPrediction[0] > latestPrediction[1];
    }
}
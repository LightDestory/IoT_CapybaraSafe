#include "tensorflow_runner.h"
#include "modules/utils/serial_logger/serial_logger.h"

namespace TENSORFLOW_RUNNER
{
    Eloquent::TinyML::TfLite<FALL_DETECTION_MODEL::NUMBER_OF_INPUTS, FALL_DETECTION_MODEL::NUMBER_OF_OUTPUTS, FALL_DETECTION_MODEL::TENSOR_ARENA_SIZE> predictor;
    float latestPrediction[2];

    bool initModel()
    {
        SERIAL_LOGGER::log("Loading machine learning model...");
        if(!predictor.begin(FALL_DETECTION_MODEL::FALL_DETECTION_MODEL_ARRAY)) {
            SERIAL_LOGGER::log("Failed to load model!");
            return false;
        }
        return true;
    }

    void requestEvaluation(SENSOR_FAKER::fall_sensor_data sensor_data)
    {
        float input[5] = {sensor_data.l_m, sensor_data.a_s, sensor_data.g_s, sensor_data.p_g_m, sensor_data.p_l_m};
        predictor.predict(input, latestPrediction);
    }

    bool fallDetected()
    {
        return latestPrediction[0] > latestPrediction[1];
    }
} // namespace TENSORFLOW_RUNNER
#ifndef TENSORFLOW_RUNNER_H_
#define TENSORFLOW_RUNNER_H_

#include <EloquentTinyML.h>
#include "modules/machine_learning/models/fall_detection_model.h"
#include "modules/sensor_faker/sensor_faker_provider.h"
#include "modules/utils/serial_logger/serial_logger.h"

namespace TENSORFLOW_RUNNER {

    extern Eloquent::TinyML::TfLite<FALL_DETECTION_MODEL::NUMBER_OF_INPUTS, FALL_DETECTION_MODEL::NUMBER_OF_OUTPUTS, FALL_DETECTION_MODEL::TENSOR_ARENA_SIZE> predictor;

    extern float latestPrediction[2];

    bool initModel();

    void requestEvaluation(SENSOR_FAKER::fall_sensor_data sensor_data);

    bool fallDetected();

}
#endif
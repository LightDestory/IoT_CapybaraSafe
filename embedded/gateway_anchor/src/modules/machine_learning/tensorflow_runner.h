#ifndef TENSORFLOW_RUNNER_H_
#define TENSORFLOW_RUNNER_H_

#include <EloquentTinyML.h>
#include "modules/machine_learning/models/heart_failture_model.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "../data_structures/data_structures.h"

namespace TENSORFLOW_RUNNER {

    extern Eloquent::TinyML::TfLite<HEART_FAILTURE_MODEL::NUMBER_OF_INPUTS, HEART_FAILTURE_MODEL::NUMBER_OF_OUTPUTS, HEART_FAILTURE_MODEL::TENSOR_ARENA_SIZE> predictor;

    extern float latestPrediction[2];

    bool initModel();

    void requestEvaluation(DATA_STRUCTURES::heart_sensor_data sensor_data);

    bool heartAttackDetected();

}
#endif
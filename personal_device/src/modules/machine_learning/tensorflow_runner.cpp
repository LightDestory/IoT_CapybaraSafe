#include "tensorflow_runner.h"

//#include <EloquentTinyML.h>
//// sine_model.h contains the array you exported from the previous step with xxd or tinymlgen
//#include "sine_model.h"
//
//
//
//Eloquent::TinyML::TfLite<NUMBER_OF_INPUTS, NUMBER_OF_OUTPUTS, TENSOR_ARENA_SIZE> ml;
//
//
//void setup() {
//    Serial.begin(115200);
//    ml.begin(sine_model);
//}
//
//void loop() {
//    // pick up a random x and predict its sine
//    float x = 3.14 * random(100) / 100;
//    float y = sin(x);
//    float input[1] = { x };
//    float predicted = ml.predict(input);
//
//    Serial.print("sin(");
//    Serial.print(x);
//    Serial.print(") = ");
//    Serial.print(y);
//    Serial.print("\t predicted: ");
//    Serial.println(predicted);
//    delay(1000);
//}
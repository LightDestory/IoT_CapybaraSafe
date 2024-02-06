#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/pin_configuration.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "modules/machine_learning/tensorflow_runner.h"
#include "modules/machine_learning/models/fall_detection_model.h"
#include "modules/machine_learning/models/hearth_failture_model.h"
#include <EloquentTinyML.h>
uint8_t interrupt_watcher = 0;

Eloquent::TinyML::TfLite<FALL_DETECTION_MODEL::NUMBER_OF_INPUTS, FALL_DETECTION_MODEL::NUMBER_OF_OUTPUTS, FALL_DETECTION_MODEL::TENSOR_ARENA_SIZE> ml;
//Eloquent::TinyML::TfLite<FALL_DETECTION_MODEL::NUMBER_OF_INPUTS, FALL_DETECTION_MODEL::NUMBER_OF_OUTPUTS, FALL_DETECTION_MODEL::TENSOR_ARENA_SIZE> ml2;
// Eloquent::TinyML::TfLite<HEARTH_FAILTURE_MODEL::NUMBER_OF_INPUTS, HEARTH_FAILTURE_MODEL::NUMBER_OF_OUTPUTS, HEARTH_FAILTURE_MODEL::TENSOR_ARENA_SIZE> ml2;


/*
 * This function is used to check if the current executed program should be interrupted and reset to the main menu.
 * The interrupt is triggered by a long press of BUTTON_1.
 */
void checkProgramInterrupt() {
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == HIGH && interrupt_watcher != 0) {
        interrupt_watcher = 0;
        return;
    }
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == LOW) {
        if (++interrupt_watcher == 10) {
            interrupt_watcher = 0;
            //GLOBALS::interrupt_flag = true;
            PIN_CONFIGURATION::resetOutputs();
            SERIAL_LOGGER::log("InterruptTriggered");
            return;
        }
    }

}

void setup() {
    Serial.begin(115200);
    SERIAL_LOGGER::log("Booting...");
    if (!DISPLAY_ESP::display_hw.init()) {
        SERIAL_LOGGER::log("Failed to initialize display!");
        while (true) {}
    }
    DISPLAY_ESP::showBootAnimation();
    PIN_CONFIGURATION::initPinMode();
    DISPLAY_ESP::updateBootAnimationProgressBar(25);
    delay(150);
    PIN_CONFIGURATION::resetOutputs();
    delay(150);
    DISPLAY_ESP::updateBootAnimationProgressBar(100);
    SERIAL_LOGGER::log("Model 1 loading");
    if(!ml.begin(FALL_DETECTION_MODEL::FALL_DETECTION_MODEL_ARRAY)) {
        SERIAL_LOGGER::log("Impossibile inizializzare il modello");
        while(true) {}
    }
    //SERIAL_LOGGER::log("Model 2 loading");
    //if(!ml2.begin(FALL_DETECTION_MODEL::FALL_DETECTION_MODEL_ARRAY)) {
    //    SERIAL_LOGGER::log("Impossibile inizializzare il modello");
    //    while(true) {}
    //}
}

void loop() {
    checkProgramInterrupt();
    float inputs[FALL_DETECTION_MODEL::NUMBER_OF_INPUTS] = {0.5236519111443385,0.3560422431484419,2.437582750036453,0.1619303413924942,0.4304841737356298};
    float outputs[2];
    ml.predict(inputs, outputs);
    String result = outputs[0] > outputs[1] ? String(FALL_DETECTION_MODEL::LABELS[0]) : String(FALL_DETECTION_MODEL::LABELS[1]);
    Serial.print("Da modello 1 risultato = " + result + "\n");
    //ml2.predict(inputs, outputs);
    //result = outputs[0] > outputs[1] ? String(HEARTH_FAILTURE_MODEL::LABELS[0]) : String(HEARTH_FAILTURE_MODEL::LABELS[1]);
    //Serial.print("Da modello 2 risultato = " + result + "\n");
    delay(500);
}
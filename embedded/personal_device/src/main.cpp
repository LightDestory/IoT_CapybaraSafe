#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/pin_configuration.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "modules/machine_learning/tensorflow_runner.h"
#include "modules/machine_learning/models/fall_detection_model.h"
#include "modules/machine_learning/models/hearth_failture_model.h"
#include <EloquentTinyML.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

uint8_t interrupt_watcher = 0;

Eloquent::TinyML::TfLite<FALL_DETECTION_MODEL::NUMBER_OF_INPUTS, FALL_DETECTION_MODEL::NUMBER_OF_OUTPUTS, FALL_DETECTION_MODEL::TENSOR_ARENA_SIZE> ml;

#define SERVICE_UUID "BF5F4A29-DE7F-4CC2-B10A-69C039FDBE1D"
#define CHARACTERISTIC_UUID "787C7A04-4ECB-4727-89AA-05E5FCB7051A"

int counter = 0;

BLECharacteristic* pCharacteristic;

/*
 * This function is used to check if the current executed program should be interrupted and reset to the main menu.
 * The interrupt is triggered by a long press of BUTTON_1.
 */
void checkProgramInterrupt()
{
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == HIGH && interrupt_watcher != 0)
    {
        interrupt_watcher = 0;
        return;
    }
    if (digitalRead(PIN_CONFIGURATION::BUTTON_1) == LOW)
    {
        if (++interrupt_watcher == 10)
        {
            interrupt_watcher = 0;
            // GLOBALS::interrupt_flag = true;
            PIN_CONFIGURATION::resetOutputs();
            SERIAL_LOGGER::log("InterruptTriggered");
            return;
        }
    }
}

void setup()
{
    Serial.begin(115200);
    SERIAL_LOGGER::log("Booting...");
    if (!DISPLAY_ESP::display_hw.init())
    {
        SERIAL_LOGGER::log("Failed to initialize display!");
        while (true)
        {
        }
    }
    DISPLAY_ESP::showBootAnimation();
    PIN_CONFIGURATION::initPinMode();
    DISPLAY_ESP::updateBootAnimationProgressBar(25);
    delay(150);
    PIN_CONFIGURATION::resetOutputs();
    delay(150);
    SERIAL_LOGGER::log("Loading machine learning model...");
    if (!ml.begin(FALL_DETECTION_MODEL::FALL_DETECTION_MODEL_ARRAY))
    {
        SERIAL_LOGGER::log("Failed to initialize model!");
        while (true)
        {
        }
    }
    DISPLAY_ESP::updateBootAnimationProgressBar(100);
    Serial.println("Starting BLE work!");

    BLEDevice::init("PersonalDevice_1");
    BLEServer *pServer = BLEDevice::createServer();
    BLEService *pService = pServer->createService(SERVICE_UUID);
    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ);
    BLEDescriptor *pDescriptor = new BLEDescriptor(BLEUUID((uint16_t)0x2901));
    pDescriptor->setValue("This is a test characteristic");
    pCharacteristic->addDescriptor(pDescriptor);
    pCharacteristic->setValue(String(counter).c_str());
    pService->start();
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    BLEDevice::startAdvertising();
    Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop()
{
    checkProgramInterrupt();
    float inputs[FALL_DETECTION_MODEL::NUMBER_OF_INPUTS] = {0.5236519111443385, 0.3560422431484419, 2.437582750036453, 0.1619303413924942, 0.4304841737356298};
    float outputs[2];
    ml.predict(inputs, outputs);
    String result = outputs[0] > outputs[1] ? String(FALL_DETECTION_MODEL::LABELS[0]) : String(FALL_DETECTION_MODEL::LABELS[1]);
    Serial.print("Da modello 1 risultato = " + result + "\n");
    if (digitalRead(PIN_CONFIGURATION::BUTTON_2) == LOW) {
        counter++;
        pCharacteristic->setValue(String(counter).c_str());
    }
    delay(500);
}
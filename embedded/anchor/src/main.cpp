#include <Arduino.h>
#include "modules/utils/globals.h"
#include "modules/display/display.h"
#include "modules/pin_configuration.h"
#include "modules/utils/serial_logger/serial_logger.h"
#include "modules/ble/bl_communication.h"

void entry_point()
{
    SERIAL_LOGGER::log("Running entry point...");
    BLE_COM::init();
    BLE_COM::GATT_Client_Device_Connection();
    BLE_COM::GATT_Client_DeviceName();
    BLE_COM::GATT_Client_Discovery();
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
    DISPLAY_ESP::updateBootAnimationProgressBar(100);
}

void loop()
{
    checkProgramInterrupt();

    entry_point();
    delay(150);
}

// funzione qui che si deve richiamare singolarmente i moduli ->

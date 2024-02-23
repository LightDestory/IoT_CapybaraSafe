#include "persistence.h"
#include "../utils/globals.h"
#include "../utils/serial_logger/serial_logger.h"

Preferences PERSISTENCE::preferences;

void PERSISTENCE::init() {
    SERIAL_LOGGER::log("Initializing preferences...");
    preferences.begin(GLOBALS::PREFERENCE_NAMESPACE.c_str(), false);
}

String PERSISTENCE::getDeviceName() {
    return GLOBALS::DEVICE_NAME + String(preferences.getUInt("ID"));
}
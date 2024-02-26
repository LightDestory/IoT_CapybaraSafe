#include "persistence.h"

namespace PERSISTENCE {

    Preferences preferences;

    void init() {
        SERIAL_LOGGER::log("Initializing preferences...");
        preferences.begin(PREFERENCE_NAMESPACE.c_str(), false);
    }

    String getDeviceName() {
        return GLOBALS::DEVICE_NAME + String(preferences.getUInt("ID"));
    }
}
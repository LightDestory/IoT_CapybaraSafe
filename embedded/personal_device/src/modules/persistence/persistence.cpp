#include "persistence.h"

namespace PERSISTENCE {

    Preferences preferences;
    String tempDeviceName = "";

    void init() {
        SERIAL_LOGGER::log("Initializing preferences...");
        preferences.begin(PREFERENCE_NAMESPACE.c_str(), false);
    }

    String getDeviceName() {
        if (preferences.getUInt("ID") == 0) {
            return GLOBALS::DEVICE_NAME + generateRandomTempDeviceName();
        }
        return GLOBALS::DEVICE_NAME + String(preferences.getUInt("ID"));
    }

    String generateRandomTempDeviceName() {
        if (tempDeviceName.length() == 0) {
            String eligible_chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
            char output[5];
            for (char &i: output) {
                uint32_t rand_int = random(0, eligible_chars.length());
                i = eligible_chars.charAt(rand_int);
            }
            output[4] = '\0';
            tempDeviceName = String(output);
        }
        return tempDeviceName;
    }
}
#include "persistence.h"

namespace PERSISTENCE {

    Preferences preferences;
    String tempDeviceName = "";

    /**
     * @brief Initializes the preferences
     */
    void init() {
        SERIAL_LOGGER::log("Initializing preferences...");
        preferences.begin(PREFERENCE_NAMESPACE.c_str(), false);
    }

    /**
     * @brief Gets the device name
     * @return The device name. If the device name is not set, it will return a random temporary device name
     */
    String getDeviceName() {
        if (preferences.getUInt("ID") == 0) {
            return GLOBALS::DEVICE_NAME + generateRandomTempDeviceName();
        }
        return GLOBALS::DEVICE_NAME + String(preferences.getUInt("ID"));
    }

    /**
     * @brief Generates a random temporary device name
     * @return The temporary device name
     */
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

    /**
     * @brief Checks if the device is a gateway
     * An anchor is considered a gateway if its ID is 1 or 254
     * @return True if the device is a gateway, false otherwise
     */
    bool isGateway() {
        return preferences.getUInt("ID") == 1 || preferences.getUInt("ID") == 254;
    }
}
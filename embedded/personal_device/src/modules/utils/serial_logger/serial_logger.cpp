#include "serial_logger.h"

namespace SERIAL_LOGGER {
    void log(const String &message) {
        Serial.println("==================");
        Serial.println(message);
        Serial.println("==================");
    }

    void log(const char *message) {
        Serial.println("==================");
        Serial.println(message);
        Serial.println("==================");
    }

    void log(const std::string &message) {
        Serial.println("==================");
        Serial.println(message.c_str());
        Serial.println("==================");
    }
}
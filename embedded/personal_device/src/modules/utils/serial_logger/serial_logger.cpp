#include "serial_logger.h"

namespace SERIAL_LOGGER {
    void log(const String &message) {
        Serial.println("==================");
        Serial.println(message);
        Serial.println("==================");
    }
}
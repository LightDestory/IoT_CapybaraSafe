#include "serial_logger.h"

void SERIAL_LOGGER::log(String message) {
    Serial.println("==================");
    Serial.println(message);
    Serial.println("==================");
}
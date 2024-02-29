#ifndef SERIAL_LOGGER_H_
#define SERIAL_LOGGER_H_

#include <Arduino.h>

namespace SERIAL_LOGGER {
    /**
     * @brief Logs a message to the serial monitor
     * @param message The message to log
     */
    void log(const String &message);

    void log(const char *message);

    void log(const std::string &message);
}
#endif
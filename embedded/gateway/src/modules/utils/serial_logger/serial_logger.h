#ifndef SERIAL_LOGGER_H_
#define SERIAL_LOGGER_H_

#include <Arduino.h>

namespace SERIAL_LOGGER {
    /*
     * This function prints to the serial the provided message
     * @param message: A string to print
     */
    void log(String message);
}
#endif
#ifndef PERSISTENCE_H
#define PERSISTENCE_H

#include <Arduino.h>
#include <Preferences.h>
#include "../utils/globals.h"
#include "../utils/serial_logger/serial_logger.h"

namespace PERSISTENCE {

    extern Preferences preferences;

    void init();


    const String PREFERENCE_NAMESPACE = "ATMR-IOT-2024";

    String getDeviceName();
}

#endif //PERSISTENCE_H

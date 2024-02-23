#ifndef PERSONAL_DEVICE_PERSISTENCE_H
#define PERSONAL_DEVICE_PERSISTENCE_H

#include <Arduino.h>
#include <Preferences.h>

namespace PERSISTENCE {

    extern Preferences preferences;

    void init();

    String getDeviceName();
}

#endif //PERSONAL_DEVICE_PERSISTENCE_H

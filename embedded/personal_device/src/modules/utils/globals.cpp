#include "globals.h"

namespace GLOBALS {
    enum RUNTIME_STATE mainLoopState = MISSING_CONFIG;
    uint8_t hardResetInterruptCounter = 0;
    bool hardResetInterrupt = false;
    uint8_t fakeBadDataInterruptCounter = 0;
    bool fakeBadDataInterrupt = false;
    bool isAlertOn = false;
    uint8_t dismissAlertInterruptCounter = 0;
    String alertMessage = "";
    uint32_t workerID = 0;
    uint32_t activityID = 0;
} //  GLOBALS
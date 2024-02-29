#include "globals.h"

namespace GLOBALS {
    enum RUNTIME_STATE mainLoopState = MISSING_CONFIG;
    uint8_t hardResetInterruptCounter = 0;
    bool hardResetInterrupt = false;
    std::vector<String> messages_queue;
    std::vector<DATA_STRUCTURES::device_descriptor> devices;

} //  GLOBALS
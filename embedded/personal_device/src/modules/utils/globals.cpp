#include "globals.h"

namespace GLOBALS {
    enum RUNTIME_STATE mainLoopState = MISSING_CONFIG;
    enum INTERRUPT_TYPES currentInterrupt = NONE;
    uint8_t interrupt_counter = 0;
    uint32_t workerID = 0;
    uint32_t activityID = 0;
} // namespace GLOBALS
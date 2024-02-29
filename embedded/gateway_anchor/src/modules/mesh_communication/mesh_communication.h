#ifndef MESH_COMMUNICATION_H
#define MESH_COMMUNICATION_H

#include "../utils/serial_logger/serial_logger.h"
#include "../persistence/persistence.h"
#include "../utils/globals.h"
#include "../ble_communication/ble_communication.h"
#include "../wifi_mqtt_communication/wifi_mqtt_communication.h"
#include <RHMesh.h>
#include <RH_RF95.h>
#include <SPI.h>

namespace MESH_COM {

    extern RH_RF95 rf95;
    extern RHMesh *manager;
    extern unsigned long nextTxTime;
    const uint16_t SEND_INTERVAL = 2000;
    const uint16_t RECEIVE_TIMEOUT = 100;
    const uint8_t LLG_SCK = 5;
    const uint8_t LLG_MISO = 19;
    const uint8_t LLG_MOSI = 27;
    const uint8_t LLG_CS = 18;
    const uint8_t LLG_RST = 23;
    const uint8_t LLG_DI0 = 26;
    const uint8_t MAX_HOP = 5;

    bool init();

    void mesh_loop(void *argv);

    uint32_t elaborateQueue();

    void receiveAndForward();
}
#endif
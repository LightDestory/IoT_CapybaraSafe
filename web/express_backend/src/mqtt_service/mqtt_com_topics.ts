/**
 * @description Contains the MQTT topics used by the MQTT communication service.
 * @property {string} CONNECTION_TEST - The topic used to test the connection to the MQTT broker.
 */
export enum MQTT_Topics {
  CONNECTION_TEST = "broker/connection_test",
  PAIRING_DEVICE = "broker/pairing_device"
}

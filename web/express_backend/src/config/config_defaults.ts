/**
 * @description Contains the default values for the configuration options.
 * @property {string} DEFAULT_HTTP_PORT - The default port for the HTTP server.
 * @property {string} DEFAULT_SECRET_KEY - The default secret key for the JWT.
 * @property {string} DEFAULT_MQTT_PROTOCOL - The default protocol for the MQTT broker.
 * @property {string} DEFAULT_MQTT_HOST - The default host for the MQTT broker.
 * @property {string} DEFAULT_MQTT_PORT - The default port for the MQTT broker.
 * @property {string} DEFAULT_DB_HOST - The default host for the database.
 * @property {string} DEFAULT_DB_PORT - The default port for the database.
 * @property {string} DEFAULT_DB_DRIVER - The default driver for the database.
 * @property {string} DEFAULT_DB_USER - The default user for the database.
 * @property {string} DEFAULT_DB_PASS - The default password for the database.
 * @property {string} DEFAULT_DB_NAME - The default name for the database.
 */
export enum CONFIG_DEFAULTS {
  // EXPRESS RELATED STUFF
  DEFAULT_HTTP_PORT = "3000",
  DEFAULT_SECRET_KEY = "capybara",
  // MQTT RELATED STUFF
  DEFAULT_MQTT_PROTOCOL = "mqtt",
  DEFAULT_MQTT_HOST = "broker.emqx.io",
  DEFAULT_MQTT_PORT = "1883",
  // DATABASE RELATED STUFF
  DEFAULT_DB_HOST = "127.0.0.1",
  DEFAULT_DB_PORT = "3306",
  DEFAULT_DB_DRIVER = "mariadb",
  DEFAULT_DB_USER = "root",
  DEFAULT_DB_PASS = "SecurePassword",
  DEFAULT_DB_NAME = "DatabaseName"
}

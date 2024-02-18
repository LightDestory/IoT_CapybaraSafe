// Purpose: Contains the default values for the configuration options.

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

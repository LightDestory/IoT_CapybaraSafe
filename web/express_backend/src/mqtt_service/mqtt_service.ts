import chalk from "chalk";
import { connect, IPublishPacket, MqttClient } from "mqtt";

import { MQTT_Topics } from "./mqtt_com_topics";
import { CONFIG_DEFAULTS } from "../config/config_defaults";
import { SocketIO_Service } from "../websocket/socketio_service";

/**
 * @description Contains the connection information for the MQTT broker.
 * @property {string} connectionUrl - The URL of the MQTT broker.
 * @property {string | undefined} username - The username for the connection to the MQTT broker.
 * @property {string | undefined} password - The password for the connection to the MQTT broker.
 */
interface ConnectionInfo {
  connectionUrl: string;
  username: string | undefined;
  password: string | undefined;
}

interface DevicePairingRequest {
  type: string;
  device_id: string;
  worker_id: string;
  activity_id: string;
}

/**
 * @description This class is a singleton that handles the communication with the MQTT broker
 */
export class MQTT_Service {
  private static instance: MQTT_Service | undefined;
  private client: MqttClient;

  /**
   * @description This constructor is private to avoid multiple instances of the class. It initializes the MQTT client.
   */
  private constructor() {
    const conn_info: ConnectionInfo = MQTT_Service.getConnectionInfo();
    this.client = connect(conn_info.connectionUrl, {
      clean: true,
      connectTimeout: 4000,
      username: conn_info.username,
      password: conn_info.password,
      reconnectPeriod: 1000,
      manualConnect: true
    });
    this.registerBaseEvents();
  }

  /**
   * @description This method registers the base events for the MQTT client.
   * The events are:
   * - connect: triggered when the client connects to the broker
   * - message: triggered when the client receives a message from a topic
   * - error: triggered when the client encounters an error
   */
  private registerBaseEvents(): void {
    this.client.on("connect", () => {
      console.log(
        chalk.green("Connected to the broker with client id:"),
        chalk.yellow(this.client.options.clientId)
      );
      this.client.publish(
        MQTT_Topics.CONNECTION_TEST,
        `Hello from ${this.client.options.clientId}`
      );
      this.client.subscribe([
        MQTT_Topics.PAIRING_DEVICE,
        MQTT_Topics.TRACKING_SYSTEM
      ]);
    });
    this.client.on(
      "message",
      (topic: string, payload: Buffer, _: IPublishPacket) => {
        this.messageDispatcher(topic, payload);
      }
    );
    this.client.on("error", (error) => {
      console.error(chalk.red("MQTT-Communication error:"), error);
    });
  }

  /**
   * @description This method publishes a message to a topic
   * @param {string} topic - The topic to publish the message to
   * @param {string} message - The message to publish
   */
  public publishMessage(topic: string, message: string) {
    this.client.publish(topic, message);
  }

  /**
   * @description This method checks if the connection to the MQTT broker is ok
   * @returns {Promise<boolean>} - A promise that resolves to true if the connection is ok, false otherwise
   */
  public async ok(): Promise<boolean> {
    this.client.connect();
    console.log(chalk.yellow("Waiting 5s to check MQTT Service status..."));
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.client.connected;
  }

  /**
   * @description This method dispatches the messages received from the topics to the appropriate handlers
   * @param topic The topic the message was received from
   * @param message The message received
   */
  private messageDispatcher(topic: string, message: Buffer) {
    switch (topic) {
      case MQTT_Topics.PAIRING_DEVICE:
        this.handlePairingRequest(JSON.parse(message.toString()));
        break;
      default:
        console.log(
          chalk.yellow("Received message from unhandled topic:"),
          chalk.blue(topic)
        );
    }
  }

  private handlePairingRequest(request: DevicePairingRequest) {
    if (!request.type || request.type === "req") {
      return;
    } else {
      SocketIO_Service.getInstance().emit(
        "pairing_request",
        JSON.stringify(request)
      );
    }
  }

  /**
   * @description This method returns the singleton instance of the class, creates it if it doesn't exist
   */
  public static getInstance(): MQTT_Service {
    if (MQTT_Service.instance != undefined) {
      return MQTT_Service.instance;
    }
    MQTT_Service.instance = new MQTT_Service();
    return MQTT_Service.instance;
  }

  /**
   * @description This method retrieves the connection info from the environment variables or the default values
   * @returns {ConnectionInfo} - The connection info
   */
  private static getConnectionInfo(): ConnectionInfo {
    const protocol: string =
      process.env.MQTT_PROTOCOL || CONFIG_DEFAULTS.DEFAULT_MQTT_PROTOCOL;
    const host: string =
      process.env.MQTT_HOST || CONFIG_DEFAULTS.DEFAULT_MQTT_HOST;
    const port: string =
      process.env.MQTT_PORT || CONFIG_DEFAULTS.DEFAULT_MQTT_PORT;
    const connectionUrl: string = `${protocol}://${host}:${port}`;
    const username: string | undefined = process.env.MQTT_USERNAME;
    const password: string | undefined = process.env.MQTT_PASSWORD;
    return { connectionUrl, username, password };
  }
}

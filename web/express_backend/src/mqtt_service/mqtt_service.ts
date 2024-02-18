import { connect, IPublishPacket, MqttClient } from "mqtt";
import { CONFIG_DEFAULTS } from "../config/config_defaults";
import { MQTT_Topics } from "./mqtt_com_topics";
import chalk from "chalk";

type ConnectionInfo = {
    connectionUrl: string
    username: string | undefined
    password: string | undefined
}

export class MQTT_Service {

    private static instance: MQTT_Service | undefined;
    private client: MqttClient;

    private constructor() {
        const conn_info: ConnectionInfo = MQTT_Service.getConnectionInfo();
        this.client = connect(
            conn_info.connectionUrl, {
            clean: true,
            connectTimeout: 4000,
            username: conn_info.username,
            password: conn_info.password,
            reconnectPeriod: 1000,
            manualConnect: true
        });
        this.registerBaseEvents();
    }

    private registerBaseEvents(): void {
        this.client.on("connect", () => {
            console.log(chalk.green("Connected to the broker with client id:"), chalk.yellow(this.client.options.clientId));
            this.client.publish(MQTT_Topics.CONNECTION_TEST, `Hello from ${this.client.options.clientId}`);
        });
        this.client.on("message", (topic: string, payload: Buffer, _: IPublishPacket) => {
            this.messageDispatcher(topic, payload);
        });
        this.client.on("error", (error) => {
            console.error(chalk.red("MQTT-Communication error:"), error);
        });
    }

    public publishMessage(topic: string, message: string) {
        this.client.publish(topic, message);
    }

    public async ok(): Promise<boolean> {
        this.client.connect();
        console.log(chalk.yellow("Waiting 5s to check MQTT Service status..."));
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.client.connected;
    }

    private messageDispatcher(topic: string, message: Buffer) {
        console.log(`Recived from ${topic} the message ${message.toString()}`);
    }

    public static getInstance(): MQTT_Service {
        if (MQTT_Service.instance != undefined) {
            return MQTT_Service.instance;
        }
        MQTT_Service.instance = new MQTT_Service();
        return MQTT_Service.instance;
    }

    private static getConnectionInfo(): ConnectionInfo {
        const protocol: string = process.env.MQTT_PROTOCOL || CONFIG_DEFAULTS.DEFAULT_MQTT_PROTOCOL;
        const host: string = process.env.MQTT_HOST || CONFIG_DEFAULTS.DEFAULT_MQTT_HOST;
        const port: string = process.env.MQTT_PORT || CONFIG_DEFAULTS.DEFAULT_MQTT_PORT;
        const connectionUrl: string = `${protocol}://${host}:${port}`
        const username: string | undefined = process.env.MQTT_USERNAME;
        const password: string | undefined = process.env.MQTT_PASSWORD;
        return { connectionUrl, username, password };
    }
}
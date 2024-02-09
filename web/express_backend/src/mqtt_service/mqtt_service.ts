import { connect, MqttClient } from "mqtt"
import { DEFAULT_MQTT_PROTOCOL, DEFAULT_MQTT_HOST, DEFAULT_MQTT_PORT } from "../config/globals";

type ConnectionInfo = {
    connectionUrl: string
    username: string | undefined
    password: string | undefined
}

export class MQTT_Service {

    private static instance: MQTT_Service | undefined;
    private client: MqttClient;

    private constructor() {
        let conn_info: ConnectionInfo = MQTT_Service.getConnectionInfo();
        this.client = connect(
            conn_info.connectionUrl, {
            clean: true,
            connectTimeout: 4000,
            username: conn_info.username,
            password: conn_info.password,
            reconnectPeriod: 1000,
        }).on("error", (error) => {
            console.log("Unable to connect to MQTT Broker:", error.name);
            process.exit(-1);
        })
        this.registerBaseEvents();
        this.client.subscribe("testing/gateway");
    }

    private registerBaseEvents(): void {
        this.client.on("connect", () => {
            console.log("Connected to the broker with client id:", this.client.options.clientId);
        });
        this.client.on("message", (topic: string, payload: Buffer, _) => {
            console.log(`Recived from ${topic} the message ${payload.toString()}`);
        })
    }

    public publishMessage(topic: string, message: string) {
        this.client.publish(topic, message);
    }

    public static getInstance(): MQTT_Service {
        if (MQTT_Service.instance != undefined) {
            return MQTT_Service.instance;
        }
        MQTT_Service.instance = new MQTT_Service();
        return MQTT_Service.instance;
    }

    private static getConnectionInfo(): ConnectionInfo {
        let protocol: string = process.env.MQTT_PROTOCOL || DEFAULT_MQTT_PROTOCOL;
        let host: string = process.env.MQTT_HOST || DEFAULT_MQTT_HOST;
        let port: string = process.env.MQTT_PORT || DEFAULT_MQTT_PORT;
        let connectionUrl: string = `${protocol}://${host}:${port}`
        let username: string | undefined = process.env.MQTT_USERNAME;
        let password: string | undefined = process.env.MQTT_PASSWORD;
        return { connectionUrl, username, password };
    }
}
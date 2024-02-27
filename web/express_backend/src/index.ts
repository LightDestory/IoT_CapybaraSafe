import "reflect-metadata";
import { createServer } from "http";
import * as path from "path";

import bodyParser from "body-parser";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";

import { CONFIG_DEFAULTS } from "./config/config_defaults";
import { DatabaseHandler } from "./db/database_handler";
import { authCheck } from "./middlewares/authMiddleware";
import { MQTT_Service } from "./mqtt_service/mqtt_service";
import { registerRoutes } from "./routes/routeManager";
import { SocketIO_Service } from "./websocket/socketio_service";

// Retrieving ENV configuration, if possible
const configuration: dotenv.DotenvConfigOutput = dotenv.config();
// Init express application
const app: Application = express();
// HTTP Server
const httpServer = createServer(app);

SocketIO_Service.initSocketIO(httpServer);

/**
 * Load the configuration and initialize the HTTP server routes
 */
function init() {
  if (configuration.error) {
    console.warn(
      chalk.yellow(
        `Unable to load .env file.\r\n${configuration.error}\r\nUsing default values...`
      )
    );
  }
  console.log(chalk.green("Loaded configuration!"));
  // Allowing everything related to cors, cors are a curse upon ourself
  app.use(cors({ origin: "*" }));
  // Enabling some express middleware for QoL
  app.use(
    express.json(),
    express.text(),
    bodyParser.urlencoded({ extended: false })
  );
  // Injecting custom Auth middleware
  app.use(authCheck);
  // Registering APIs routes
  registerRoutes(app);
  // Font-End Client serving, nothing for now
  app.use(express.static(path.join(__dirname, "static")));
  app.get("/*", async (_, res) => {
    res.sendFile(path.resolve(__dirname, "static", "index.html"));
  });
}

/**
 * Starts all the services.
 * The main services are:
 * - MQTT Service: used to connect to the MQTT broker and listen to the topics
 * - Database Service: used to connect to the database and perform CRUD operations
 * - HTTP Server: used to expose the APIs to the clients
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when all the services are up and running
 */
async function bootstrap() {
  // Checking MQTT Service status
  console.log(chalk.blue("Checking MQTT Service status..."));
  const mqtt_connected: boolean = await MQTT_Service.getInstance().ok();
  if (!mqtt_connected) {
    console.error(chalk.red("MQTT Service is not available, shutting down..."));
    process.exit(-1);
  }
  // Checking Database status
  console.log(chalk.blue("Checking Database status..."));
  const database_connected: boolean = await DatabaseHandler.getInstance().ok();
  if (!database_connected) {
    console.error(chalk.red("Database is not available, shutting down..."));
    process.exit(-1);
  }
  // Starting HTTP Server
  console.log(chalk.blue("Starting HTTP Server..."));
  const port = process.env.HTTP_PORT || CONFIG_DEFAULTS.DEFAULT_HTTP_PORT;
  httpServer
    .listen(port, () => {
      console.log(
        chalk.yellow("HTTP APIs will use the following security key:"),
        chalk.red(process.env.SECRET_KEY || CONFIG_DEFAULTS.DEFAULT_SECRET_KEY)
      );
      console.log(
        chalk.green("HTTP Server listening to port", chalk.yellow(port))
      );
    })
    .on("error", () => {
      console.error(chalk.red("Unable to start http server!"));
      process.exit(-1);
    });
}

init();
bootstrap();

import "reflect-metadata";
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { DEFAULT_SECRET_KEY, DEFAULT_HTTP_PORT } from "./config/globals"
import { authCheck } from "./middlewares/authMiddleware";
import { registerRoutes } from "./routes/routeManager";
import dotenv from 'dotenv';
import * as path from 'path';
import { MQTT_Service } from './mqtt_service/mqtt_service';
import { DatabaseHandler } from './db/database_handler';

// Retrieving ENV configuration, if possible
const configuration: dotenv.DotenvConfigOutput = dotenv.config();
// Init express application
const app: Application = express();

function bootstrap() {
  if (configuration.error) {
    console.warn(`Unable to load .env file.\r\n${configuration.error}\r\nUsing default values...`);
  }
  console.log("Loaded configuration!");
  console.log(`HTTP APIs will use the following security key: ${process.env.SECRET_KEY || DEFAULT_SECRET_KEY}`);
  let port = process.env.HTTP_PORT || DEFAULT_HTTP_PORT;
  // Allowing everything related to cors, cors are a curse upon ourself
  app.use(cors({ origin: '*' }));
  // Enabling some express middleware for QoL
  app.use(express.json(), express.text(), bodyParser.urlencoded({ extended: false }));
  // Injecting custom Auth middleware
  app.use(authCheck);
  // Registering APIs routes
  registerRoutes(app);
  // Font-End Client serving, nothing for now
  app.use(express.static(path.join(__dirname, 'static')));
  app.get('/*', async (_, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
  });
  // Running http server
  app.listen(port, async () => {
    console.log(`HTTP Server listening to ${port}!`);
    // Checking MQTT Service status
    let mqtt_connected: boolean = await MQTT_Service.getInstance().ok();
    if (!mqtt_connected) {
      console.log("MQTT Service is not available, shutting down...");
    }
    // Checking Database status
    let database_connected: boolean = await DatabaseHandler.getInstance().ok();
    if (!database_connected) {
      console.log("Database is not available, shutting down...");
      process.exit(-1);
    }
  }).on("error", () => {
    console.log("Unable to start http server!");
    process.exit(-1);
  });
}

bootstrap();
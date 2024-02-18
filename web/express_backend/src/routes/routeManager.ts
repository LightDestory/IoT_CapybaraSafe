import { sendRoute } from "./sendRoute";
import { pingRoute } from "./pingRoute";
import { workerRoute } from "./workerRoute";
import { Application } from "express";

/*
    The routeMagaer is used to register all the routes.
    Update the registerRoutes function when a new route is defined.
 */

// Register routes on the express application
export function registerRoutes(app: Application) {
  app.use("/api/ping", pingRoute);
  app.use("/api/send", sendRoute);
  app.use("/api/worker", workerRoute);
}

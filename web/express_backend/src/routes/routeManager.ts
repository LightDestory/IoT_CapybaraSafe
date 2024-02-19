import { pingRoute } from "./pingRoute";
import { workerRoute } from "./workerRoute";
import { alertRoute } from "./alertRoute";
import { activityRoute } from "./activityRoute";
import { anchorRoute } from "./anchorRoute";
import { trackingDeviceRoute } from "./trackingDeviceRoute";
import { Application } from "express";

/**
 * This function is used to register all the routes in the application
 * @param app The express application
 */
export function registerRoutes(app: Application) {
  app.use("/api/ping", pingRoute);
  app.use("/api/alert", alertRoute);
  app.use("/api/activity", activityRoute);
  app.use("/api/anchor", anchorRoute);
  app.use("/api/tracking_device", trackingDeviceRoute);
  app.use("/api/worker", workerRoute);
}

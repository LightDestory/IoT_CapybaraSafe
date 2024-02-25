import { Application } from "express";

import { activityRoute } from "./activityRoute";
import { alertRoute } from "./alertRoute";
import { anchorRoute } from "./anchorRoute";
import { assignRoute } from "./assignRoute";
import { pingRoute } from "./pingRoute";
import { remoteTrackingRoute } from "./remoteTrackingRoute";
import { trackingDeviceRoute } from "./trackingDeviceRoute";
import { workerRoute } from "./workerRoute";


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
  app.use("/api/remote_tracking", remoteTrackingRoute);
  app.use("/api/assign", assignRoute);
  app.use("/api/worker", workerRoute);
}

import express, { Request, Response, Router } from "express";

import Activity from "../db/models/Activity";
import RemoteTracking from "../db/models/RemoteTracking";
import Worker from "../db/models/Worker";
export const remoteTrackingRoute: Router = express.Router();

/**
 * This route is used to retrieve all the remoteTrackings from the database
 */
remoteTrackingRoute.get("/all", async (_: Request, res: Response) => {
  const remoteTrackings: RemoteTracking[] = await RemoteTracking.findAll({
    order: [["timestamp", "DESC"]],
    include: [Activity, Worker]
  });
  res.status(200).json({ status: "success", data: remoteTrackings });
});
/**
 * This route is used to retrieve a specific remoteTracking from the database
 */
remoteTrackingRoute.get("/:identity", async (req: Request, res: Response) => {
  const identity: string[] = req.params.identity.split("-");
  const remoteTracking: RemoteTracking | null = await RemoteTracking.findOne({
    where: {
      worker_id: identity[0],
      activity_id: identity[1],
      device_id: identity[2]
    },
    include: [Activity, Worker]
  });
  if (remoteTracking) {
    res.status(200).json({ status: "success", data: remoteTracking });
    return;
  }
  res.status(404).send({ status: "error", data: "RemoteTracking not found" });
});
/**
 * This route is used to delete all the remoteTrackings from the database
 */
remoteTrackingRoute.delete("/all", async (_: Request, res: Response) => {
  const deletedItems: number = await RemoteTracking.destroy({ where: {} });
  res
    .status(200)
    .json({ status: "success", data: `Deleted ${deletedItems} items` });
});

/**
 * This route is used to delete a specific remoteTracking from the database
 */
remoteTrackingRoute.delete(
  "/:identity",
  async (req: Request, res: Response) => {
    const identity: string[] = req.params.identity.split("-");
    const remoteTracking: RemoteTracking | null = await RemoteTracking.findOne({
      where: {
        worker_id: identity[0],
        activity_id: identity[1],
        device_id: identity[2]
      }
    });
    if (remoteTracking) {
      await remoteTracking.destroy();
      res.status(200).json({ status: "success", data: "Successfully deleted" });
      return;
    }
    res.status(404).send({ status: "error", data: "RemoteTracking not found" });
  }
);

/**
 * This route is used to create or update a remoteTracking in the database.
 * The request body should contain the remoteTracking data
 * @example
 * {
 * "mac_address": "49:31:31:27:23:64",
 * "last_maintenance": "2023-10-13T00:00:00.000Z",
 * "firmware_version": "v2.0"
 * }
 */
remoteTrackingRoute.post("/", async (req: Request, res: Response) => {
  if (!req.body.worker_id || !req.body.device_id || !req.body.activity_id) {
    res.status(400).json({ status: "error", data: "Invalid request" });
    return;
  }
  try {
    let remote_tracking: RemoteTracking | null = await RemoteTracking.findOne({
      where: {
        worker_id: req.body.worker_id,
        device_id: req.body.device_id,
        activity_id: req.body.activity_id
      }
    });
    if (!remote_tracking) {
      remote_tracking = await RemoteTracking.create(req.body);
    } else {
      remote_tracking.set(req.body);
      remote_tracking = await remote_tracking.save();
    }
    res.status(201).json({ status: "success", data: remote_tracking });
  } catch (error) {
    res.status(400).json({ status: "error", data: "Invalid request" });
  }
});

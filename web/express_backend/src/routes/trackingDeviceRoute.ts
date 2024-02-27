import express, { Request, Response, Router } from "express";

import Activity from "../db/models/Activity";
import RemoteTracking from "../db/models/RemoteTracking";
import TrackingDevice, { DEVICE_STATUSES } from "../db/models/TrackingDevice";
import Worker from "../db/models/Worker";
import { MQTT_Service } from "../mqtt_service/mqtt_service";
import { MQTT_Topics } from "../mqtt_service/mqtt_com_topics";
import { activityRoute } from "./activityRoute";
export const trackingDeviceRoute: Router = express.Router();

/**
 * This route is used to retrieve all the trackingDevices from the database
 * It accepts a query parameter to filter the devices by status
 * @example
 * endpont: /tracking_device/all?status=available
 * status: "in use", "available"
 */
trackingDeviceRoute.get("/all", async (req: Request, res: Response) => {
  const filter: string | undefined = req.query.status as string | undefined;
  if (filter && !DEVICE_STATUSES.includes(filter.toLowerCase())) {
    res.status(400).json({ status: "error", data: "Invalid status" });
    return;
  }
  const trackingDevices: TrackingDevice[] = await TrackingDevice.findAll({
    include: {
      model: RemoteTracking,
      include: [Activity, Worker]
    }
  }).then((devices: TrackingDevice[]) => {
    if (filter) {
      if (filter === "available") {
        return devices.filter((device: TrackingDevice) =>
          device.remote_trackings.every(
            (remoteTracking: RemoteTracking) =>
              remoteTracking.activity?.status !== "in progress"
          )
        );
      } else {
        return devices.filter((device: TrackingDevice) =>
          device.remote_trackings.some(
            (remoteTracking: RemoteTracking) =>
              remoteTracking.activity?.status === "in progress"
          )
        );
      }
    }
    return devices;
  });
  res.status(200).json({ status: "success", data: trackingDevices });
});

/**
 * This route is used to retrieve a specific trackingDevice from the database
 */
trackingDeviceRoute.get(
  "/^:id([0-9]+)",
  async (req: Request, res: Response) => {
    const trackingDevice: TrackingDevice | null = await TrackingDevice.findByPk(
      req.params.id,
      {
        include: {
          model: RemoteTracking,
          include: [Activity, Worker]
        }
      }
    );
    if (trackingDevice) {
      res.status(200).json({ status: "success", data: trackingDevice });
      return;
    }
    res.status(404).send({ status: "error", data: "TrackingDevice not found" });
  }
);
/**
 * This route is used to delete all the trackingDevices from the database
 */
trackingDeviceRoute.delete("/all", async (_: Request, res: Response) => {
  const deletedItems: number = await TrackingDevice.destroy({ where: {} });
  res
    .status(200)
    .json({ status: "success", data: `Deleted ${deletedItems} items` });
});

/**
 * This route is used to delete a specific trackingDevice from the database
 */
trackingDeviceRoute.delete("/:id", async (req: Request, res: Response) => {
  const trackingDevice: TrackingDevice | null = await TrackingDevice.findByPk(
    req.params.id
  );
  if (trackingDevice) {
    await trackingDevice.destroy();
    res.status(200).json({ status: "success", data: "Successfully deleted" });
    return;
  }
  res.status(404).send({ status: "error", data: "TrackingDevice not found" });
});

/**
 * This route is used to create a new trackingDevice in the database.
 * The request body should contain the trackingDevice data
 * @example
 * {
 * "mac_address": "49:31:31:27:23:64",
 * "last_maintenance": "2023-10-13T00:00:00.000Z",
 * "firmware_version": "v2.0"
 * }
 */
trackingDeviceRoute.post("/", async (req: Request, res: Response) => {
  try {
    const newTrackingDeviceID: number = (await TrackingDevice.create(req.body))
      .id;
    const newData: TrackingDevice | null =
      await TrackingDevice.findByPk(newTrackingDeviceID);
    res.status(201).json({ status: "success", data: newData });
  } catch (error) {
    res.status(400).json({ status: "error", data: "Invalid request" });
  }
});

/**
 * This route is used to update a specific trackingDevice in the database.
 * The request body should contain the new trackingDevice data
 * @example
 * {
 * "mac_address": "49:31:31:27:23:64",
 * "last_maintenance": "2023-10-13T00:00:00.000Z",
 * "firmware_version": "v2.0"
 * }
 */
trackingDeviceRoute.post("/:id", async (req: Request, res: Response) => {
  const trackingDevice: TrackingDevice | null = await TrackingDevice.findByPk(
    req.params.id
  );
  if (trackingDevice) {
    trackingDevice.set(req.body);
    try {
      const newTrackingDevice: TrackingDevice = await trackingDevice.save();
      res.status(200).json({ status: "success", data: newTrackingDevice });
      return;
    } catch (error) {
      res.status(400).json({ status: "error", data: "Invalid request" });
      return;
    }
  }
  res.status(404).send({ status: "error", data: "TrackingDevice not found" });
});

trackingDeviceRoute.get(
  "/pair_request",
  async (req: Request, res: Response) => {
    const query: string | undefined = req.query.data as string | undefined;
    if (!query) {
      res.status(400).json({ status: "error", data: "Invalid request" });
      return;
    }
    const ids: string[] = query.split("-");
    const activity: Activity | null = await Activity.findByPk(ids[0]);
    const worker: Worker | null = await Worker.findByPk(ids[1]);
    const trackingDevice: TrackingDevice | null = await TrackingDevice.findByPk(
      ids[2]
    );
    if (activity && worker && trackingDevice) {
      MQTT_Service.getInstance().publishMessage(
        MQTT_Topics.PAIRING_DEVICE,
        JSON.stringify({
          type: "req",
          activity_id: ids[0],
          worker_id: ids[1],
          device_id: ids[2]
        })
      );
      res.status(200).json({ status: "success", data: "Pairing Request sent" });
      return;
    }
    res.status(404).send({ status: "error", data: "Resources not found" });
  }
);

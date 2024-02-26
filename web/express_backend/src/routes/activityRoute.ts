import express, { Request, Response, Router } from "express";

import Activity, { ACTIVITY_STATUSES } from "../db/models/Activity";
import Alert from "../db/models/Alert";
import RemoteTracking from "../db/models/RemoteTracking";
import TrackingDevice from "../db/models/TrackingDevice";
import Worker from "../db/models/Worker";
import { MQTT_Topics } from "../mqtt_service/mqtt_com_topics";
import { MQTT_Service } from "../mqtt_service/mqtt_service";

export const activityRoute: Router = express.Router();
/**
 * This route is used to retrieve all the activities from the database
 * It accepts a query parameter to filter the activities by status
 * @example
 * endpont: /activity/all?status=completed
 * status: "in progress", "to be completed", "scheduled", "completed"
 */
activityRoute.get("/all", async (req: Request, res: Response) => {
  const filter: string | undefined = req.query.status as string | undefined;
  if (filter && !ACTIVITY_STATUSES.includes(filter.toLowerCase())) {
    res.status(400).json({ status: "error", data: "Invalid status" });
    return;
  }
  const activities: Activity[] = await Activity.findAll({
    include: [
      Alert,
      Worker,
      { model: RemoteTracking, include: [TrackingDevice] }
    ],
    where: filter ? { status: filter } : {},
    order: [["scheduled_date", "DESC"]]
  });
  res.status(200).json({ status: "success", data: activities });
});

/**
 * This route is used to retrieve a specific activity from the database
 */
activityRoute.get("^:id([0-9]+)", async (req: Request, res: Response) => {
  const activity: Activity | null = await Activity.findByPk(req.params.id, {
    include: [
      Alert,
      Worker,
      { model: RemoteTracking, include: [TrackingDevice] }
    ]
  });
  if (activity) {
    res.status(200).json({ status: "success", data: activity });
    return;
  }
  res.status(404).send({ status: "error", data: "Activity not found" });
});

/**
 * This route is used to start the activity
 */
activityRoute.get("/start", async (req: Request, res: Response) => {
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
    try {
      activity.set({ status: "in progress" });
      const newActivity: Activity = await activity.save();
      MQTT_Service.getInstance().publishMessage(
        MQTT_Topics.PAIRING_DEVICE,
        JSON.stringify({
          activity_id: ids[0],
          worker_id: ids[1],
          device_id: ids[2]
        })
      );
      res.status(200).json({ status: "success", data: newActivity });
      return;
    } catch (error) {
      res.status(400).json({ status: "error", data: "Invalid request" });
      return;
    }
  }
  res.status(404).send({ status: "error", data: "Resources not found" });
});

/**
 * This route is used to delete all the activity from the database
 */
activityRoute.delete("/all", async (_: Request, res: Response) => {
  const deletedItems: number = await Activity.destroy({ where: {} });
  res
    .status(200)
    .json({ status: "success", data: `Deleted ${deletedItems} items` });
});

/**
 * This route is used to delete a specific activity from the database
 */
activityRoute.delete("/:id", async (req: Request, res: Response) => {
  const activity: Activity | null = await Activity.findByPk(req.params.id);
  if (activity) {
    await activity.destroy();
    res.status(200).json({ status: "success", data: "Successfully deleted" });
    return;
  }
  res.status(404).send({ status: "error", data: "Activity not found" });
});

/**
 * This route is used to create a new activity in the database.
 * The request body should contain the activity data
 * @example
 * {
 *     "text_description": "Dare da mangiare ai capybara",
 *     "duration_minute": 50,
 *     "scheduled_date": "2024-02-13T21:00:00.000Z",
 *     "status": "in progress"
 * }
 */
activityRoute.post("/", async (req: Request, res: Response) => {
  try {
    const newActivityID: number = (await Activity.create(req.body)).id;
    const newData: Activity | null = await Activity.findByPk(newActivityID);
    res.status(201).json({ status: "success", data: newData });
  } catch (error) {
    res.status(400).json({ status: "error", data: "Invalid request" });
  }
});
//
/**
 * This route is used to update a specific activity in the database.
 * The request body should contain the new activity data
 * @example
 * {
 * "text_description": "Dare da mangiare ai capybara",
 * "duration_minute": 50,
 * "scheduled_date": "2024-02-13T21:00:00.000Z",
 * "status": "in progress"
 * }
 */
activityRoute.post("/:id", async (req: Request, res: Response) => {
  const activity: Activity | null = await Activity.findByPk(req.params.id);
  if (activity) {
    activity.set(req.body);
    try {
      const newActivity: Activity = await activity.save();
      res.status(200).json({ status: "success", data: newActivity });
      return;
    } catch (error) {
      res.status(400).json({ status: "error", data: "Invalid request" });
      return;
    }
  }
  res.status(404).send({ status: "error", data: "Activity not found" });
});

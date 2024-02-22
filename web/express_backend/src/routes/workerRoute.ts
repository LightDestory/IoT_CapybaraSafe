import express, { Request, Response, Router } from "express";
import Activity from "../db/models/Activity";
import Worker from "../db/models/Worker";
import RemoteTracking from "../db/models/RemoteTracking";
import TrackingDevice from "../db/models/TrackingDevice";

export const workerRoute: Router = express.Router();
/**
 * This route is used to retrieve all the workers from the database
 */
workerRoute.get("/all", async (_: Request, res: Response) => {
  const workers: Worker[] = await Worker.findAll({
    include: [
      Activity,
      {
        model: RemoteTracking,
        include: [TrackingDevice]
      }
    ]
  });
  res.status(200).json({ status: "success", data: workers });
});

/**
 * This route is used to retrieve a specific worker from the database
 */
workerRoute.get("/:id", async (req: Request, res: Response) => {
  const worker: Worker | null = await Worker.findByPk(req.params.id, {
    include: [
      Activity,
      {
        model: RemoteTracking,
        include: [TrackingDevice]
      }
    ]
  });
  if (worker) {
    res.status(200).json({ status: "success", data: worker });
    return;
  }
  res.status(404).send({ status: "error", data: "Worker not found" });
});

/**
 * This route is used to delete all the workers from the database
 */
workerRoute.delete("/all", async (_: Request, res: Response) => {
  const deletedItems: number = await Worker.destroy({ where: {} });
  res
    .status(200)
    .json({ status: "success", data: `Deleted ${deletedItems} items` });
});

/**
 * This route is used to delete a specific worker from the database
 */
workerRoute.delete("/:id", async (req: Request, res: Response) => {
  const worker: Worker | null = await Worker.findByPk(req.params.id);
  if (worker) {
    await worker.destroy();
    res.status(200).json({ status: "success", data: "Successfully deleted" });
    return;
  }
  res.status(404).send({ status: "error", data: "Worker not found" });
});

/**
 * This route is used to create a new worker in the database.
 * The request body should contain the worker data
 * @example
 * {
 * "first_name": "Elda",
 * "last_name": "Silvestri",
 * "profession": "Idraulico",
 * }
 */
workerRoute.post("/", async (req: Request, res: Response) => {
  try {
    const newWorkerID: number = (await Worker.create(req.body)).id;
    const newData: Worker | null = await Worker.findByPk(newWorkerID);
    res.status(201).json({ status: "success", data: newData });
  } catch (error) {
    res.status(400).json({ status: "error", data: "Invalid request" });
  }
});

/**
 * This route is used to update a specific worker in the database.
 * The request body should contain the new worker data
 * @example
 * {
 * "first_name": "Elda",
 * "last_name": "Silvestri",
 * "profession": "Idraulico",
 * }
 */
workerRoute.post("/:id", async (req: Request, res: Response) => {
  const worker: Worker | null = await Worker.findByPk(req.params.id);
  if (worker) {
    worker.set(req.body);
    try {
      const newWorker: Worker = await worker.save();
      res.status(200).json({ status: "success", data: newWorker });
      return;
    } catch (error) {
      res.status(400).json({ status: "error", data: "Invalid request" });
      return;
    }
  }
  res.status(404).send({ status: "error", data: "Worker not found" });
});

import express, { Request, Response, Router } from "express";
import Assignment from "../db/models/Assignment";
export const assignRoute: Router = express.Router();

/**
 * This route is used to delete all the assignments from the database
 */
assignRoute.delete("/all", async (_: Request, res: Response) => {
  const deletedItems: number = await Assignment.destroy({ where: {} });
  res
    .status(200)
    .json({ status: "success", data: `Deleted ${deletedItems} items` });
});

/**
 * This route is used to delete a specific assignment from the database
 * It excepts a worker id and a activity id as json parameter in the request body
 * @example
 * {
 *    "worker_id": 1,
 *    "activity_id": 1
 * }
 */
assignRoute.delete("/", async (req: Request, res: Response) => {
  const req_worker_id: number | undefined = req.body.worker_id;
  const req_activity_id: number | undefined = req.body.activity_id;
  if (!req_worker_id || !req_activity_id) {
    res.status(400).json({ status: "error", data: "Invalid request" });
    return;
  }
  const assignment: Assignment | null = await Assignment.findOne({
    where: {
      worker_id: req_worker_id,
      activity_id: req_activity_id
    }
  });
  if (assignment) {
    await assignment.destroy();
    res.status(200).json({ status: "success", data: "Successfully deleted" });
    return;
  }
  res.status(404).send({ status: "error", data: "Assignment not found" });
});

/**
 * This route is used to create a new assignment in the database.
 * It excepts a worker id and a activity id as json parameter in the request body
 * @example
 * {
 *    "worker_id": 1,
 *    "activity_id": 1
 * }
 */
assignRoute.post("/", async (req: Request, res: Response) => {
  try {
    const newAssignmentID: number = (await Assignment.create(req.body)).id;
    const newData: Assignment | null =
      await Assignment.findByPk(newAssignmentID);
    res.status(201).json({ status: "success", data: newData });
  } catch (error) {
    res.status(400).json({ status: "error", data: "Invalid request" });
  }
});

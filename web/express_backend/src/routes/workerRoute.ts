import express, { Request, Response, Router } from "express";
import Worker from "../db/models/Worker";

export const workerRoute: Router = express.Router();

workerRoute.get("/all", async (req: Request, res: Response) => {
  console.log("GET /all");
  const workers = await Worker.findAll();
  res.status(200).json(workers);
});

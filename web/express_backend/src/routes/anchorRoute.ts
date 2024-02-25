import express, { Request, Response, Router } from "express";

import Anchor from "../db/models/Anchor";

export const anchorRoute: Router = express.Router();
/**
 * This route is used to retrieve all the anchors from the database
 */
anchorRoute.get("/all", async (req: Request, res: Response) => {
  const anchors: Anchor[] = await Anchor.findAll();
  res.status(200).json({ status: "success", data: anchors });
});

/**
 * This route is used to retrieve a specific anchor from the database
 */
anchorRoute.get("/:id", async (req: Request, res: Response) => {
  const anchor: Anchor | null = await Anchor.findByPk(req.params.id);
  if (anchor) {
    res.status(200).json({ status: "success", data: anchor });
    return;
  }
  res.status(404).send({ status: "error", data: "Anchor not found" });
});

/**
 * This route is used to delete all the anchors from the database
 */
anchorRoute.delete("/all", async (_: Request, res: Response) => {
  const deletedItems: number = await Anchor.destroy({ where: {} });
  res
    .status(200)
    .json({ status: "success", data: `Deleted ${deletedItems} items` });
});

/**
 * This route is used to delete a specific anchor from the database
 */
anchorRoute.delete("/:id", async (req: Request, res: Response) => {
  const anchor: Anchor | null = await Anchor.findByPk(req.params.id);
  if (anchor) {
    await anchor.destroy();
    res.status(200).json({ status: "success", data: "Successfully deleted" });
    return;
  }
  res.status(404).send({ status: "error", data: "Anchor not found" });
});

/**
 * This route is used to create a new anchor in the database.
 * The request body should contain the anchor data
 * @example
 * {
 * "mac_address": "11:11:11:11:11:11",
 * "status": "working"
 * }
 */
anchorRoute.post("/", async (req: Request, res: Response) => {
  try {
    const newAnchorID: number = (await Anchor.create(req.body)).id;
    const newData: Anchor | null = await Anchor.findByPk(newAnchorID);
    res.status(201).json({ status: "success", data: newData });
  } catch (error) {
    res.status(400).json({ status: "error", data: "Invalid request" });
  }
});

/**
 * This route is used to update a specific anchor in the database.
 * The request body should contain the new anchor data
 * @example
 * {
 * "mac_address": "11:11:11:11:11:11",
 * "status": "working"
 * }
 */
anchorRoute.post("/:id", async (req: Request, res: Response) => {
  const anchor: Anchor | null = await Anchor.findByPk(req.params.id);
  if (anchor) {
    anchor.set(req.body);
    try {
      const newAnchor: Anchor = await anchor.save();
      res.status(200).json({ status: "success", data: newAnchor });
      return;
    } catch (error) {
      res.status(400).json({ status: "error", data: "Invalid request" });
      return;
    }
  }
  res.status(404).send({ status: "error", data: "Anchor not found" });
});

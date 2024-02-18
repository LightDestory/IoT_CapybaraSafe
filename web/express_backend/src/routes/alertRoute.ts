import express, { Request, Response, Router } from "express";
import Alert from "../db/models/Alert";
import Activity from "../db/models/Activity";

export const alertRoute: Router = express.Router();

alertRoute.get("/all", async (_: Request, res: Response) => {
    const alerts: Alert[] = await Alert.findAll({include: [Activity]});
    res.status(200).json({ status: "success", data: alerts });
});

alertRoute.get("/:id", async (req: Request, res: Response) => {
    const alert: Alert | null = await Alert.findByPk(req.params.id, {include: [Activity]});
    if (alert) {
        res.status(200).json({ status: "success", data: alert });
        return;
    }
    res.status(404).send({ status: "error", data: "Alert not found"});
});

alertRoute.delete("/all", async (_: Request, res: Response) => {
    const deletedItems: number = await Alert.destroy({where: {}});
    res.status(200).json({ status: "success", data: `Deleted ${deletedItems} items` });
});

alertRoute.delete("/:id", async (req: Request, res: Response) => {
    const alert: Alert | null = await Alert.findByPk(req.params.id);
    if (alert) {
        await alert.destroy();
        res.status(200).json({ status: "success", data: "Successfully deleted" });
        return;
    }
    res.status(404).send({ status: "error", data: "Alert not found"});
});

alertRoute.post("/", async (req: Request, res: Response) => {
    try {
        const newAlertID: number = (await Alert.create(req.body)).id;
        const newData: Alert | null = await Alert.findByPk(newAlertID, {include: [Activity]});
        res.status(201).json({ status: "success", data: newData });
    } catch(error) {
        res.status(400).json({ status: "error", data: "Invalid request"});
    }
});

alertRoute.post("/:id", async (req: Request, res: Response) => {
    const alert: Alert | null = await Alert.findByPk(req.params.id);
    if (alert) {
        alert.set(req.body);
        try {
            const newAlert = await alert.save();
            res.status(200).json({ status: "success", data: newAlert });
            return;
        } catch (error) {
            res.status(400).json({ status: "error", data: "Invalid request"});
            return;
        }
    }
    res.status(404).send({ status: "error", data: "Alert not found"});
});


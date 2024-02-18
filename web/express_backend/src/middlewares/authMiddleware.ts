import { NextFunction, Request, Response } from "express";
import { CONFIG_DEFAULTS } from "../config/config_defaults";

export function authCheck(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.indexOf("/api/") == -1) {
        next();
        return;
    }
    const auth: string | undefined = req.headers.authorization;
    const local_key = process.env.SECRET_KEY || CONFIG_DEFAULTS.DEFAULT_SECRET_KEY;
    if (!auth || auth != local_key) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
    }
    next()
}
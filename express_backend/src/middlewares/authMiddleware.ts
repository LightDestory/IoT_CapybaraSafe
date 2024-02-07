import {NextFunction, Request, Response} from "express";
import { DEFAULT_SECRET_KEY } from "../config/globals";

export function authCheck(req: Request, res: Response, next: NextFunction) {
    if(req.originalUrl.indexOf("/api/") == -1){
        next();
        return;
    }
    let auth: string | undefined = req.headers.authorization;
    let local_key = process.env.SECRET_KEY || DEFAULT_SECRET_KEY;
    if (!auth || auth != local_key) {
        res.sendStatus(403);
        return;
    }
    next()
}
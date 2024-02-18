import express, { Request, Response, Router } from 'express';

export const pingRoute: Router = express.Router();


/**
 * This API is used to test the connection to the server
 */
pingRoute.get('/', (_: Request, res: Response) => {
    res.status(200).json({ status: "success", message: "Pong!" });
});
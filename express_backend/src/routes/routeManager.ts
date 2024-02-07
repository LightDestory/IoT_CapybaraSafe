import {sendRoute} from "./sendRoute";
import {Application} from "express";

/*
    The routeMagaer is used to register all the routes.
    Update the registerRoutes function when a new route is defined.
 */

// Register routes on the express application
export function registerRoutes(app: Application) {
    app.use('/api/send', sendRoute);
}
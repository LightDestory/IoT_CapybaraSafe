import express, {Request, Response, Router} from 'express';
import { MQTT_Service } from '../mqtt_service/mqtt_service';

export const sendRoute: Router = express.Router();


/**
 * This testing api reads text from the GET parameter and forward to the mqtt broker
 * endpoint => .../send?text=message
 */
sendRoute.get('/', (req: Request, res: Response) => {
    let text: string = req.query.text as string;
    if (!text) {
        res.sendStatus(400);
        return;
    }
    MQTT_Service.getInstance().publishMessage("testing/gateway", text);
    res.status(200).send("Success");
});
import { TwitchMessageTypes } from '../constants';
import { webHookActions, } from '../services';
import { Request, Response, } from 'express';

export default async (req: Request, res: Response) => {
    const messageType = req.header("Twitch-Eventsub-Message-Type");
    if (messageType === TwitchMessageTypes.webhook_callback_verification) {
        return res.status(200)
            .setHeader("Content-Type", "text/plain")
            .send(req.body.challenge);
    };

    const key = messageType as keyof typeof webHookActions;
    const action = webHookActions[key]

    const {
        status,
        data,
    } = await action(req);

    return res
        .status(status)
        .send(data);

    const { type } = req.body.subscription;
    const { event } = req.body;

    console.log(
      `Receiving ${type} request for ${event.broadcaster_user_name}: `, event
    );

    if (type === "stream.online") {
        console.log(event.broadcaster_user_name);
        res.status(200);
    };

    res.status(200).end();
};

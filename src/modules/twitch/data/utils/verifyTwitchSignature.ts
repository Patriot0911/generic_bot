import { Request, Response, } from 'express';
import crypto from 'crypto';

const twitchSigningSecret = process.env.TWITCH_SECRET;

const verifyTwitchSignature = (req: Request, res: Response, buf: Buffer, encoding: string) => {
    const messageId = req.header("Twitch-Eventsub-Message-Id") as string;
    const timestamp = req.header("Twitch-Eventsub-Message-Timestamp") as any;
    const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
    const time = Math.floor(new Date().getTime() / 1000);

    if (Math.abs(time - timestamp) > 600) {
        console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
        throw new Error("Ignore this request.");
    };

    if (!twitchSigningSecret)
        throw new Error("Twitch signing secret is empty.");

    const computedSignature = "sha256=" +
        crypto
            .createHmac("sha256", twitchSigningSecret)
            .update(messageId + timestamp + buf)
            .digest("hex");

    if (messageSignature !== computedSignature)
        throw new Error("Invalid signature.");
};

export default verifyTwitchSignature;

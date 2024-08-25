import { Request } from 'express';

export default async (req: Request) => {
    const { type } = req.body.subscription;
    const { event } = req.body;
    console.log(event);
    const channel = req.client.guilds.cache.get('988069910724882432')?.channels.cache.get('988736602190778428');
    if(channel?.isTextBased()) {
        await channel.send({
            content: 'Hi!',
        });
    };
    return {
        status: 200,
        data: [],
    }
};

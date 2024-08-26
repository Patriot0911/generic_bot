import { twitchGuild } from '@/entities/twitch';
import TwitchService from '../TwitchService';
import { Request } from 'express';

export default async (req: Request) => {
    const { type } = req.body.subscription;
    const { event } = req.body;
    if(type !== 'stream.online')
        return {
            status: 200,
            data: [],
        };
    console.log(event);
    if(!event || !event.broadcaster_user_id)
        return {
            status: 200,
            data: [],
        };
    const guildRepository = req.client.dataSource.getRepository(twitchGuild);
    const guildDataList = await guildRepository.find({
        where: {
            subscriptions: {
                broadcaster_id: event.broadcaster_user_id,
            },
            messages: {
                subscription: {
                    broadcaster_id: event.broadcaster_user_id,
                },
            },
        },
    });
    const userName = event.broadcaster_user_name;
    const embed = (displayName: string) => ({
        title: displayName,
        color: 12452860,
        url: TwitchService.getStreamUrl(userName),
        thumbnail: {
            url: TwitchService.getStreamPreview(userName),
        },
        timestamp: event.started_at,
    });
    for(const guildData of guildDataList) {
        const defaultChannelId = guildData.defaultChannel;
        const displayName = guildData.subscriptions[0].streamerName;
        const guild = req.client.guilds.cache.get(guildData.guildId);
        if(!guild)
            continue;
        const defaultChannel = guild.channels.cache.get(defaultChannelId);
        if(!guildData.messages || guildData.messages.length < 1) {
            if(!defaultChannel || !defaultChannel.isTextBased())
                continue;
            defaultChannel.send({
                embeds: [embed(displayName)],
            });
            continue;
        };
        for(const message of guildData.messages) {
            const channel = message.channelId ? guild.channels.cache.get(message.channelId) : defaultChannel;
            if(!channel || !channel.isTextBased())
                continue;
            channel.send({
                embeds: [embed(displayName)],
            });
        };
    };
    return {
        status: 200,
        data: [],
    };
};

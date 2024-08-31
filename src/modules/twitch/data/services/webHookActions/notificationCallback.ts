import subscription from '@/entities/twitch/subscription.entity';
import TwitchService from '../TwitchService';
import { Request } from 'express';

export default async (req: Request) => {
    const { type } = req.body.subscription;
    const { event } = req.body;
    console.log(event);
    if(type !== 'stream.online')
        return {
            status: 200,
            data: [],
        };
    if(!event || !event.broadcaster_user_id)
        return {
            status: 200,
            data: [],
        };
    const subscriptionRepository = req.client.dataSource.getRepository(subscription);
    const subscriptionData = await subscriptionRepository.findOne({
        where: {
            broadcaster_id: event.broadcaster_user_id,
        },
        relations: {
            guilds: {
                messages: true,
            },
            messages: true,
        },
    });
    if(!subscriptionData || !subscriptionData.guilds || subscriptionData.guilds.length < 1)
        return {
            status: 200,
            data: [],
        };
    const displayName = event.broadcaster_user_name;
    const userLogin = event.broadcaster_user_login;
    const embed = {
        title: displayName,
        color: 12452860,
        url: TwitchService.getStreamUrl(userLogin),
        image: {
            url: TwitchService.getStreamPreview(userLogin),
        },
        timestamp: event.started_at,
    };
    for(const guildData of subscriptionData.guilds) {
        const defaultChannelId = guildData.defaultChannel;
        const guild = req.client.guilds.cache.get(guildData.guildId);
        if(!guild)
            continue;
        const defaultChannel = guild.channels.cache.get(defaultChannelId);
        if(!guildData.messages || guildData.messages.length < 1) {
            if(!defaultChannel || !defaultChannel.isTextBased())
                continue;
            defaultChannel.send({
                embeds: [embed],
            });
            continue;
        };
        for(const message of guildData.messages) {
            const channel = message.channelId ? guild.channels.cache.get(message.channelId) : defaultChannel;
            if(!channel || !channel.isTextBased())
                continue;
            channel.send({
                embeds: [embed],
            });
        };
    };
    return {
        status: 200,
        data: [],
    };
};

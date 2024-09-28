import subscription from '@/entities/twitch/subscription.entity';
import { notificationFallback, } from '../../utils/embeds';
import TwitchService from '../TwitchService';
import Handlebars from 'handlebars';
import { Request, } from 'express';
import { time, } from 'discord.js';
import axios from 'axios';

export default async (req: Request) => {
    const { type, } = req.body.subscription;
    const { event, } = req.body;
    if(type != 'stream.online')
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
                notifications: true,
            },
        },
        select: {
            guilds: true,
        }
    });
    if(!subscriptionData || !subscriptionData.guilds || subscriptionData.guilds.length < 1)
        return {
            status: 200,
            data: [],
        };
    const userLogin = event.broadcaster_user_login;
    const { data: streamerInfo, } = await TwitchService.getStreamer(userLogin);
    const started_at = streamerInfo.started_at ? `${time(new Date(streamerInfo.started_at))}` : `${time(new Date())}`
    const streamContext = {
        started_at,
        credits: 'Overwatch UA',
        stream_title: streamerInfo.title,
        game_name: streamerInfo.game_name,
        timestamp: new Date().toISOString(),
        display_name: streamerInfo.display_name,
        stream_thumbnail_url: streamerInfo.thumbnail_url,
        stream_url: TwitchService.getStreamUrl(userLogin),
        stream_preview: TwitchService.getStreamPreview(userLogin),
    };
    const fallbackEmbed = JSON.parse(notificationFallback(streamContext));
    const createEmbedWithContext = (embed: string) => {
        try {
            return JSON.parse(Handlebars.compile(embed)(streamContext));
        } catch(e) {
            return fallbackEmbed;
        };
    };
    for(const guildData of subscriptionData.guilds) {
        const defaultChannelId = guildData.defaultChannel;
        const guild = req.client.guilds.cache.get(guildData.guildId);
        if(!guild)
            continue;
        const defaultChannel = guild.channels.cache.get(defaultChannelId);
        if(!guildData.notifications)
            continue;
        for(const notification of guildData.notifications) {
            const channel = notification.channelId ? guild.channels.cache.get(notification.channelId) : defaultChannel;
            if(!channel || !channel.isTextBased())
                continue;
            const embed = notification.embed ? createEmbedWithContext(notification.embed) : fallbackEmbed;
            if(notification.webhook) {
                axios.post(notification.webhook, {
                    content: null,
                    embeds: [embed],
                }).catch(
                    (e) => {
                        channel.send({
                            embeds: [fallbackEmbed],
                        });
                    },
                );
            } else {
                channel.send({
                    embeds: [embed],
                }).catch(
                    (e) => {
                        channel.send({
                            embeds: [fallbackEmbed],
                        });
                    }
                );
            };
        };
    };
    return {
        status: 200,
        data: [],
    };
};

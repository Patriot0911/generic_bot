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
            notifications: {
                guild: true,
            },
        },
        select: {
            notifications: true,
        }
    });
    if(!subscriptionData || !subscriptionData.notifications || subscriptionData.notifications.length < 1)
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
    for(const notification of subscriptionData.notifications) {
        console.log(notification);
        if(!notification || !notification.guild)
            continue;
        const guild = req.client.guilds.cache.get(notification.guild.guildId);
        if(!guild)
            continue;
        const defaultChannelId = notification.guild.defaultChannel;
        const channel = notification.channelId ? (
            guild.channels.cache.get(notification.channelId) ?? guild.channels.cache.get(defaultChannelId)
        ) : guild.channels.cache.get(defaultChannelId);
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
    return {
        status: 200,
        data: [],
    };
};

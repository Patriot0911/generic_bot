import { DMChannel, NonThreadGuildBasedChannel, } from 'discord.js';
import { isChillCreator, chillServices, } from '../utils';
import modClient from '@/modClient';

export default async function (channel: (DMChannel | NonThreadGuildBasedChannel)) {
    if(!channel.isVoiceBased())
        return;
    const guildId = channel.guildId;
    const channelId = channel.id;
    if(!isChillCreator(guildId, channelId))
        return;
    const client = <modClient> channel.client;
    chillServices.deleteCreator(client, guildId, channelId);
};

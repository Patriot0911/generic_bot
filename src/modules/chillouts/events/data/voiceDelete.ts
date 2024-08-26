import { DMChannel, NonThreadGuildBasedChannel, } from 'discord.js';
import { isChillCreator, chillServices, isTempChill, } from '../../data/utils';
import modClient from '@/modClient';

export default async function (channel: (DMChannel | NonThreadGuildBasedChannel)) {
    if(!channel.isVoiceBased())
        return;
    const guildId = channel.guildId;
    const channelId = channel.id;
    const client = <modClient> channel.client;
    if(isChillCreator(guildId, channelId))
        return chillServices.deleteCreator(client, guildId, channelId);
    if(isTempChill(guildId, channelId))
        return chillServices.deleteTemp(client, guildId, channelId);
};

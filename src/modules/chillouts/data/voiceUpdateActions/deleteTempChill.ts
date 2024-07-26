import { chillServices, isChillCreator } from '../utils';
import { Guild, VoiceBasedChannel } from 'discord.js';
import { chillTemps } from '../utils/constants';
import modClient from '@/modClient';

export default async function (client: modClient, channel: VoiceBasedChannel, guild: Guild) {
    if(!channel || !guild || isChillCreator(guild.id, channel.id))
        return;
    const chillId = `${guild.id}:${channel.id}`;
    const isTempChill = [...chillTemps.keys()].includes(chillId);
    if(
        channel.members.size > 0 ||
        !isTempChill
    )
        return;
    const id = chillTemps.get(chillId)
    if(!id)
        return;
    await chillServices.deleteTempChill(client, id);
    channel.delete('Chill Temp Channel');
};

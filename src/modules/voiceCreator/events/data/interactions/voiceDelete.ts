import { DMChannel, NonThreadGuildBasedChannel, } from 'discord.js';
import { isTempVoice, voiceServices } from '@/modules/voiceCreator/data';
import { isVoiceCreator, } from '../utils';
import modClient from '@/modClient';

export default async function (channel: (DMChannel | NonThreadGuildBasedChannel)) {
    if(!channel.isVoiceBased())
        return;
    const guildId = channel.guildId;
    const channelId = channel.id;
    const client = <modClient> channel.client;
    if(isVoiceCreator(guildId, channelId))
        return voiceServices.deleteCreator(client, guildId, channelId);
    if(isTempVoice(guildId, channelId))
        return voiceServices.deleteTemp(client, guildId, channelId);
};

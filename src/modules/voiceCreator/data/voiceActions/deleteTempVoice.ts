import { Guild, VoiceBasedChannel } from 'discord.js';
import isVoiceCreator from '../validators/isVoiceCreator';
import voiceServices from '../voiceServices';
import isTempVoice from '../validators/isTempVoice';
import modClient from '@/modClient';

export default async function (client: modClient, channel: VoiceBasedChannel, guild: Guild) {
    if(
        !channel ||
        !guild ||
        channel.members.size > 0 ||
        isVoiceCreator(guild.id, channel.id) ||
        !isTempVoice(guild.id, channel.id)
    )
        return;
    voiceServices.deleteTemp(client, guild.id, channel.id);
    channel.delete('Chill Temp Channel');
};

import { Guild, User, VoiceBasedChannel, } from 'discord.js';
import isVoiceCreator from '../validators/isVoiceCreator';
import isTempVoice from '../validators/isTempVoice';
import { voiceTemps } from '../constants';
import modClient from '@/modClient';
import voiceServices from '../voiceServices';

export default async function (client: modClient, channel: VoiceBasedChannel, guild: Guild, user: User) {
    if(
        !channel ||
        !guild ||
        channel.members.size < 1 ||
        isVoiceCreator(guild.id, channel.id) ||
        !isTempVoice(guild.id, channel.id)
    )
        return;
    const key = `${guild.id}:${channel.id}`;
    const tempChannelInfo = voiceTemps.get(key);
    if(!tempChannelInfo)
        return;
    const newOwnerId = channel.members.firstKey();
    if(!newOwnerId)
        return;
    if(tempChannelInfo.ownerId === user.id)
        voiceServices.changeTempOwner(client, guild.id, channel.id, newOwnerId);
};

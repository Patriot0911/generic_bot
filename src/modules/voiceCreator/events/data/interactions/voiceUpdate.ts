import { deleteTempVoice, createTempVoice, changeTempOwner, } from "@/modules/voiceCreator/data";
import { isTempVoice, isVoiceCreator, } from "../utils";
import { VoiceState, } from "discord.js";
import modClient from "@/modClient";
import { voiceTemps } from "@/modules/voiceCreator/data/constants";

export default async function (oldState: VoiceState, newState: VoiceState) {
    if(
        (!oldState.channel && !newState.channel) ||
        (oldState.channel && newState.channel && oldState.channelId === newState.channelId) ||
        (
            oldState.channel && newState.channel &&
            newState.channelId === oldState.channelId
        )
    )
        return;
    const client = <modClient> oldState.client;

    if(
        newState &&
        newState.channel &&
        isVoiceCreator(newState.guild.id, newState.channel.id)
    ) {
        const {
            guild,
            channel,
            member,
        } = newState;
        if(!member)
            return;
        createTempVoice(client, channel, guild, member);
    };
    if(
        oldState &&
        oldState.channel &&
        !isVoiceCreator(oldState.guild.id, oldState.channel.id) &&
        isTempVoice(oldState.guild.id, oldState.channel.id)
    ) {
        const {
            guild,
            channel,
        } = oldState;
        if(channel.members.size < 1)
            return deleteTempVoice(client, channel, guild);
        const user = oldState.member?.user;
        if(!user)
            return;
        changeTempOwner(client, channel, guild, user);
    };
};

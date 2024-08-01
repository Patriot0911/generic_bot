import { deleteTempVoice, createTempVoice, } from "@/modules/voiceCreator/data";
import { isTempVoice, isVoiceCreator, } from "../utils";
import { VoiceState, } from "discord.js";
import modClient from "@/modClient";

export default async function (oldState: VoiceState, newState: VoiceState) {
    if(
        (!oldState.channel && !newState.channel) ||
        (oldState.channel && newState.channel && oldState.channelId === newState.channelId)
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
        deleteTempVoice(client, channel, guild)
    };
};

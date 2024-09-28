import { createTempChill, deleteTempChill } from "../../data/voiceUpdateActions";
import { isChillCreator, isTempChill } from "../../data/utils";
import { VoiceState, } from "discord.js";
import modClient from "@/modClient";

export default async function (oldState: VoiceState, newState: VoiceState) {
    if(
        (!oldState.channel && !newState.channel)
        ||
        (oldState.channel && newState.channel && oldState.channelId === newState.channelId)
    )
        return;
    const client = <modClient> oldState.client;

    if(
        newState &&
        newState.channel &&
        isChillCreator(newState.guild.id, newState.channel.id)
    ) {
        const {
            guild,
            channel,
        } = newState;
        createTempChill(client, channel, guild);
    };
    if(
        oldState &&
        oldState.channel &&
        !isChillCreator(oldState.guild.id, oldState.channel.id) &&
        isTempChill(oldState.guild.id, oldState.channel.id)
    ) {
        const {
            guild,
            channel,
        } = oldState;
        deleteTempChill(client, channel, guild);
    };
};

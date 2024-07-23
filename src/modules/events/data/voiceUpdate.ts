import { chillCreators, chillTemps, } from "@/modules/commands/data/constants";
import isChillCreator from "@/modules/commands/data/isChillCreator";
import chillServices from "@/modules/commands/data/chillServices";
import { ChannelType, VoiceState, } from "discord.js";
import modClient from "@/modClient";

export default async function (oldState: VoiceState, newState: VoiceState) {
    if(!oldState.channel && !newState.channel)
        return;
    const client = <modClient> oldState.client;
    if(newState.channel && isChillCreator(newState.guild.id, newState.channel.id)) {
        const channelParent = newState.channel.parent;
        const chillOptions = chillCreators.get(`${newState.guild.id}:${newState.channel.id}`);
        if(!chillOptions)
            return;
        const creatorName = newState.channel.name;
        const creatorLimit = newState.channel.userLimit;
        const newChannel = await newState.guild.channels.create({
            name:       creatorName,
            userLimit:  creatorLimit,
            parent:     channelParent,
            type:       ChannelType.GuildVoice,
        });
        if(!newChannel)
            return;
        await newState.channel.setName(chillOptions.channelName);
        await newState.channel.setUserLimit(chillOptions.limit);
        const dataCreator = await chillServices.addCreator(client, {
            channelId: newChannel.id,
            guildId: newChannel.guild.id,
            channelName: chillOptions.channelName,
            limit: chillOptions.limit,
        });
        chillCreators.delete(`${newState.guild.id}:${newState.channel.id}`);
        chillCreators.set(`${newChannel.guild.id}:${newChannel.id}`, {
            ...chillOptions,
            id: dataCreator.id,
        });
        await chillServices.deleteCreator(client, chillOptions.id);
        const dataChill = await chillServices.addTempChill(client, {
            channelId: newState.channel.id,
            guildId: newState.guild.id,
        });
        chillTemps.set(`${newState.guild.id}:${newState.channel.id}`, dataChill.id);
    };
    if(
        oldState.channel && !isChillCreator(oldState.guild.id, oldState.channel.id)
    ) {
        if(
            oldState.channel.members.size > 0 ||
            ![...chillTemps.keys()].includes(`${oldState.guild.id}:${oldState.channel.id}`)
        )
            return;
        const id = chillTemps.get(`${oldState.guild.id}:${oldState.channel.id}`)
        if(!id)
            return;
        await chillServices.deleteCreator(client, id);
        oldState.channel.delete('Chill Temp Channel');
    };
};

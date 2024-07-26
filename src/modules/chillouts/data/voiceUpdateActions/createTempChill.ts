import { ChannelType, Guild, VoiceBasedChannel, } from "discord.js";
import { chillCreators, chillTemps } from "../utils/constants";
import { chillServices, isChillCreator } from "../utils";
import modClient from "@/modClient";

export default async function (client: modClient, channel: VoiceBasedChannel, guild: Guild) {
    if(!channel || !guild || !isChillCreator(guild.id, channel.id))
        return;

    if(!client.guilds.cache.get(guild.id)) {
        // delete creator from db;
        return;
    };

    const channelParent = channel.parent;
    const guildId = guild.id;

    const chillOptions = chillCreators.get(`${guildId}:${channel.id}`);
    if(!chillOptions)
        return;
    const creatorName = channel.name;
    const creatorLimit = channel.userLimit;
    const perms = channel.permissionOverwrites.cache.get(guildId);

    const newChannel = await guild.channels.create({
        name:       creatorName,
        userLimit:  creatorLimit,
        parent:     channelParent,
        type:       ChannelType.GuildVoice,
        position:   8,
        permissionOverwrites: perms ? [{
            ...perms,
        }] :[],
    });
    const dataCreator = await chillServices.addCreator(client, {
        channelName: chillOptions.channelName,
        limit: chillOptions.limit,
        channelId: newChannel.id,
        guildId: guildId,
    });
    chillCreators.set(`${guildId}:${newChannel.id}`, {
        ...chillOptions,
        id: dataCreator.id,
    });
    if(!newChannel)
        return;
    await channel.setName(chillOptions.channelName);
    await channel.setUserLimit(chillOptions.limit);
    const dataChill = await chillServices.addTempChill(client, {
        channelId: channel.id,
        guildId: guildId,
    });
    chillCreators.delete(`${guildId}:${channel.id}`);
    chillTemps.set(`${guildId}:${channel.id}`, dataChill.id);
    chillServices.deleteCreator(client, chillOptions.id);
    if(channel.members.size < 1 && channel) {
        channel.delete('Empty temp voice');
        // delete temp channel*
    };
};

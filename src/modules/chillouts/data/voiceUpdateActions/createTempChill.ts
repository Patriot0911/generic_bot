import { ChannelType, Guild, VoiceBasedChannel, } from "discord.js";
import { chillServices, isChillCreator } from "../utils";
import { chillCreators, } from "../utils/constants";
import modClient from "@/modClient";

export default async function (client: modClient, channel: VoiceBasedChannel, guild: Guild) {
    if(!channel || !guild || !isChillCreator(guild.id, channel.id))
        return;

    if(!client.guilds.cache.get(guild.id))
        return chillServices.deleteCreator(client, guild.id, channel.id);

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
    if(!newChannel)
        return;
    await chillServices.deleteCreator(client, channel.guild.id, channel.id);
    await chillServices.addCreator(client, {
        channelName: chillOptions.channelName,
        limit: chillOptions.limit,
        channelId: newChannel.id,
        guildId: guildId,
    });
    await channel.setName(chillOptions.channelName);
    await channel.setUserLimit(chillOptions.limit);
    await chillServices.addTemp(client, {
        channelId: channel.id,
        guildId: guild.id,
    });
    if(channel && channel.members.size < 1) {
        await chillServices.deleteTemp(client, channel.guild.id, channel.id);
        channel.delete('Empty temp voice');
    };
};

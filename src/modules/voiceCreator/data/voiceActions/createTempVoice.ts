import { ChannelType, Guild, GuildMember, VoiceBasedChannel, } from "discord.js";
import isVoiceCreator from "../validators/isVoiceCreator";
import { voiceCreators, } from "../constants";
import voiceServices from "../voiceServices";
import modClient from "@/modClient";

export default async function (client: modClient, channel: VoiceBasedChannel, guild: Guild, member: GuildMember) {
    if(!channel || !guild || !isVoiceCreator(guild.id, channel.id))
        return;

    if(!client.guilds.cache.get(guild.id))
        return voiceServices.deleteCreator(client, guild.id, channel.id);

    const guildId = guild.id;

    const creatorOptions = voiceCreators.get(`${guildId}:${channel.id}`);
    if(!creatorOptions)
        return;
    const channelParent = (creatorOptions.catId ? guild.channels.cache.get(creatorOptions.catId) : channel.parent) ?? channel.parent;
    if(channelParent?.type !== ChannelType.GuildCategory)
        return;
    const creatorName = creatorOptions.channelName;
    const creatorLimit = creatorOptions.limit;
    const perms = channel.permissionOverwrites.cache.get(guildId); // improve with options

    const newChannel = await guild.channels.create({
        name:       creatorName,
        userLimit:  creatorLimit,
        parent:     channelParent,
        type:       ChannelType.GuildVoice,
        permissionOverwrites: perms ? [{
            ...perms,
        }] :[],
    });
    const channelId = newChannel.id;
    try {
        await member.voice.setChannel(newChannel);
    } catch(e) {
        if(newChannel)
            newChannel.delete('Empty temp voice');
        return;
    };

    if(!newChannel)
        return;
    await voiceServices.addTemp(client, {
        channelId: channelId,
        guildId: guildId,
        ownerId: member.user.id,
    });
    if(!newChannel)
        return voiceServices.deleteTemp(client, guildId, channelId);
    if(newChannel.members.size < 1) {
        await voiceServices.deleteTemp(client, guildId, channelId);
        newChannel.delete('Empty temp voice');
    };
};

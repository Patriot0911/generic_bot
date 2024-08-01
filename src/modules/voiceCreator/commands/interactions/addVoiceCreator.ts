import { ChannelType, ChatInputCommandInteraction } from 'discord.js';
import { createTempVoice, isVoiceCreator, voiceServices, } from '../../data';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes } from '@/constants';
import { addVoiceCreator, } from '../data';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    const channel = interaction.options.getChannel('channel');
    const category = interaction.options.getChannel('category');
    const guild = interaction.guild;
    if(!channel || !guild)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong',
        });
    const channelId = channel.id;
    const guildId = guild.id;
    if(isVoiceCreator(guildId, channelId))
        return interaction.reply({
            ephemeral: true,
            content: 'Channel is already creator',
        });
    const channelName = interaction.options.getString('name');
    const limit = interaction.options.getNumber('limit') ?? 0;
    if(!channelName)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong with command args',
        });
    const guildState = client.guilds.cache.get(guildId);
    if(!guildState)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong with guilds def.',
        });
    const channelState = guildState.channels.cache.get(channelId);
    if(!channelState || channelState.type !== ChannelType.GuildVoice)
        return interaction.reply({
            ephemeral: true,
            content: 'Channel not found',
        });
    await voiceServices.addCreator(client, {
        channelId,
        channelName,
        catId: category?.id,
        guildId,
        limit,
    });
    if(!channelState) {
        voiceServices.deleteCreator(client, channelId, guildId);
        return interaction.reply({
            ephemeral: true,
            content: 'Channel interaction error',
        });
    };
    if(channelState && channelState.members.size > 0) {
        for(const [_, member] of channelState.members) {
            createTempVoice(client, channelState, guild, member);
        };
    };
    interaction.reply({
        ephemeral: true,
        content: 'Channel added successfully',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'addcreator',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = addVoiceCreator;

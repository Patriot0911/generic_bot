import { chillServices, isChillCreator, } from '../../data/utils';
import { ChannelType, ChatInputCommandInteraction } from 'discord.js';
import { createTempChill } from '../../data/voiceUpdateActions';
import { TModuleContentInfo } from '@/types/client';
import { addChillCreator } from '../../data/commands';
import { ModuleContentTypes } from '@/constants';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    const channel = interaction.options.getChannel('channel');
    const guild = interaction.guild;
    if(!channel || !guild)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong',
        });
    const channelId = channel.id;
    const guildId = guild.id;
    if(isChillCreator(guildId, channelId))
        return interaction.reply({
            ephemeral: true,
            content: 'Channel is already chill creator',
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
    await chillServices.addCreator(client, {
        channelId,
        guildId,
        channelName,
        limit,
    });
    if(!channelState) {
        chillServices.deleteCreator(client, channelId, guildId);
        return interaction.reply({
            ephemeral: true,
            content: 'Channel interaction error',
        });
    };
    if(channelState && channelState.members.size > 0)
        createTempChill(client, channelState, guild);
    interaction.reply({
        ephemeral: true,
        content: 'Channel added successfully',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'addchillcreator',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = addChillCreator;

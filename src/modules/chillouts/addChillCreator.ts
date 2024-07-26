import { chillServices, isChillCreator, } from './data/utils';
import chillCreator from '@/entities/chillCreator.entity';
import { ChatInputCommandInteraction } from 'discord.js';
import { chillCreators } from './data/utils/constants';
import { TModuleContentInfo } from '@/types/client';
import { addChillCreator } from './data/commands';
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
    if(isChillCreator(guild.id, channel.id))
        return interaction.reply({
            ephemeral: true,
            content: 'Channel is already chill creator',
        });
    const channelName = interaction.options.getString('name');
    const limit = interaction.options.getNumber('limit');
    if(!channelName || !limit)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong with command args',
        });
    const data = await chillServices.addCreator(client, {
        channelId: channel.id,
        guildId: guild.id,
        channelName,
        limit,
    })
    const options = {
        channelName,
        limit,
        id: data.id,
    };
    chillCreators.set(`${guild.id}:${channel.id}`, options);
    const chillRepository = client.dataSource.getRepository(chillCreator);
    await chillRepository.save({
        channelId: channel.id,
        guildId: guild.id,
        channelName,
        limit,
    });
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

import { ChatInputCommandInteraction, } from 'discord.js';
import { addNotification, } from '../../data/commands';
import { TModuleContentInfo } from '@/types/client';
import { TwitchService } from '../../data/services';
import { ModuleContentTypes } from '@/constants';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    const streamerName = interaction.options.getString('name');
    if(!streamerName)
        return;
    const {
        data: userData,
        message: userMessage,
    } = await TwitchService.getStreamer(streamerName);
    if(userMessage)
        return interaction.reply({
            ephemeral: true,
            content: userMessage,
        });
    console.log(userData);

    const { data, message, } = await TwitchService.callAddStreamer(userData.id);
    if(message)
        return interaction.reply({
            ephemeral: true,
            content: message,
        });

    console.log(data);
    return interaction.reply({
        ephemeral: true,
        content: `Success`,
    })
};

export const contentInfo: TModuleContentInfo = {
    name: 'add_notification',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = addNotification;

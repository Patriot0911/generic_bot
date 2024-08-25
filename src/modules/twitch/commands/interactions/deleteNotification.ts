import deleteNotification from '../data/deleteNotification';
import { ChatInputCommandInteraction, } from 'discord.js';
import { TModuleContentInfo } from '@/types/client';
import { TwitchService } from '../../data/services';
import { ModuleContentTypes } from '@/constants';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    const subId = interaction.options.getString('name');
    if(!subId)
        return;
    const {
        data,
        message: userMessage,
    } = await TwitchService.deleteSubscription(subId);
    if(userMessage)
        return interaction.reply({
            ephemeral: true,
            content: userMessage,
        });
    console.log(data);
    return interaction.reply({
        ephemeral: true,
        content: `Success`,
    })
};

export const contentInfo: TModuleContentInfo = {
    name: 'delete_notification',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = deleteNotification;

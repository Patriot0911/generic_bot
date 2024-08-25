import { ChatInputCommandInteraction } from 'discord.js';
import { TModuleContentInfo } from '@/types/client';
import { TwitchService } from '../../data/services';
import { ModuleContentTypes } from '@/constants';
import { listNotifications, } from '../data';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    const {
        data,
        message,
    } = await TwitchService.getSubscriptionList();
    console.log(data);
    // console.log(data.data[data.data.length-1]);
    if(message)
        return interaction.reply({
            ephemeral: true,
            content: message,
        });
    interaction.reply({
        ephemeral: true,
        content: 'Success',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'list_notifications',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = listNotifications;

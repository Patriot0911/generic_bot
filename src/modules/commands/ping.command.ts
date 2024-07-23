import { ChatInputCommandInteraction, } from 'discord.js';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default function (interaction: ChatInputCommandInteraction, client: modClient) {
    console.log(client.getModulesList());
    interaction.reply({
        ephemeral: true,
        content: 'pong',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'ping',
    type: ModuleContentTypes.Load,
};

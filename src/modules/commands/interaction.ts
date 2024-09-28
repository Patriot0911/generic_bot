import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { commandInteractions } from './data/constants';
import { TModuleContentInfo } from '@/types/client';
import { Interaction } from 'discord.js';
import modClient from '@/modClient';

export default function (client: modClient) {
    client.on(
        'interactionCreate',
        (interaction: Interaction) => {
            if(!interaction.isCommand())
                return;
            const commandCallback = commandInteractions.get(interaction.commandName);
            if(!commandCallback)
                return;
            commandCallback(interaction, client);
        }
    );
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInteraction',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

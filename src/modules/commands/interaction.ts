import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';
import { Interaction } from 'discord.js';

export default function (client: modClient) {
    client.on(
        'interactionCreate',
        (interaction: Interaction) => {
            if(!interaction.isCommand())
                return;
            const commandCallback = client.getModuleContent('commands', interaction.commandName);
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

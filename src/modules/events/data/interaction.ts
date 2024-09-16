import { Interaction, MessageComponentInteraction, ModalSubmitInteraction, } from 'discord.js';
import { availableInteractions, componentInteractions, } from './constsants';
import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo, } from '@/types/client';
import modClient from '@/modClient';

export default function (interaction: Interaction) {
    if(!availableInteractions.includes(interaction.type))
        return;
    const client = <modClient> interaction.client;
    const moduleGroup = interaction.isMessageComponent() ? componentInteractions[interaction.componentType] : (
        interaction.isModalSubmit() && 'modals'
    );
    if(!moduleGroup)
        return;
    const subInteraction = (<ModalSubmitInteraction | MessageComponentInteraction> interaction)
    const callback = client.getModuleContent(moduleGroup, subInteraction.customId);
    if(!callback)
        return;
    return callback(interaction, client);
};

export const contentInfo: TModuleContentInfo = {
    name: 'defaultInteraction',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

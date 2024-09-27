import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo, } from '@/types/client';
import { ready, interaction, } from './data';
import modClient from '@/modClient';

export default function (client: modClient) {
    client.on('ready', ready);
    client.on('interactionCreate', interaction);
};

export const contentInfo: TModuleContentInfo = {
    name: 'initEvents',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

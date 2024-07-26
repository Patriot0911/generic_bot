import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import { ready, voiceUpdate, } from './data/events';
import modClient from '@/modClient';

export default function (client: modClient) {
    client.on('ready', ready);
    client.on('voiceStateUpdate', voiceUpdate);
};

export const contentInfo: TModuleContentInfo = {
    name: 'initEvents',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

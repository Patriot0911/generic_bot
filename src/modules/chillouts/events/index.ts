import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { ready, voiceDelete, voiceUpdate, } from './data';
import { TModuleContentInfo, } from '@/types/client';
import modClient from '@/modClient';

export default function (client: modClient) {
    client.on('ready', ready);
    client.on('voiceStateUpdate', voiceUpdate);
    client.on('channelDelete', voiceDelete);
};

export const contentInfo: TModuleContentInfo = {
    name: 'initEvents',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

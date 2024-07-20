import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';

export default function  (client: modClient) {
    client.on(
        'ready', (client) => console.log(client)
    );
};

export const contentInfo: TModuleContentInfo = {
    name: 'onReady',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnDbLoad,
};

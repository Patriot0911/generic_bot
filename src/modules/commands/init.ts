import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';

export default function (client: modClient) {
    // console.log(client);
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPostLoad,
};

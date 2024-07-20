import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import { test } from './data/commands.data';
import modClient from '@/modClient';

export default function initCommands (client: modClient) {
    test();
    console.log(client);
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPostLoad,
};

import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';
import { ready } from './data';

export default function (cl: modClient) {
    cl.on('ready', ready);
};

export const contentInfo: TModuleContentInfo = {
    name: 'onReady',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

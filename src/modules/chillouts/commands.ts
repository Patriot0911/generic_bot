import { ModuleContentTypes, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';
import { commandInfo } from './addChillCreator';

export default function (_: modClient) {
    return [
        commandInfo,
    ];
};

export const contentInfo: TModuleContentInfo = {
    name: 'chillCommands',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

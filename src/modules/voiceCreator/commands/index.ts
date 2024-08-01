import { addVoiceCreator, } from './data/index';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default function (_: modClient) {
    return [
        addVoiceCreator,
    ];
};

export const contentInfo: TModuleContentInfo = {
    name: 'voiceCreatorCommands',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

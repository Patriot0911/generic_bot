import { ModuleContentTypes, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';

export default function (cl: modClient) {
};

export const contentInfo: TModuleContentInfo = {
    name: 'ping',
    type: ModuleContentTypes.Load,
};

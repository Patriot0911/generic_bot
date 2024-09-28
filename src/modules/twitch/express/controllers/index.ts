import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';
import { callback, } from './data';
import { Router } from 'express';

export default function (_: modClient) {
    const router = Router();

    router.post('/webhooks/callback', callback);

    return {
        prefix: 'twitch',
        data: router,
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitch_routes',
    subModule: 'express',
    type: ModuleContentTypes.TempLoad,
};

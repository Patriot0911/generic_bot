import { verifyTwitchSignature, } from '@/modules/twitch/data/utils';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';
import express from "express";

export default function (_: modClient) {
    return {
        prefix: 'twitch',
        data: express.json({ verify: verifyTwitchSignature, }),
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitch_signature',
    subModule: 'express',
    type: ModuleContentTypes.TempLoad,
};

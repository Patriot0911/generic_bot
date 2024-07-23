import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';
import fs from 'node:fs/promises';

export default async function (client: modClient) {
    const commandsList = await fs.readdir(__dirname.concat('/data/info'));
    for(const command of commandsList) {
        const {
            default: commandInfo,
        } = await import(`./data/info/${command}`);
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPostLoad,
};

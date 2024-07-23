import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import commandLoader from './data/commandLoader';
import { CommandType, } from './data/constants';
import modClient from '@/modClient';
import fs from 'node:fs/promises';
import path from 'node:path';

export default async function (client: modClient) {
    const commandsList = await fs.readdir(__dirname.concat('/data/info'));
    for(const command of commandsList) {
        const {
            default: commandData,
        } = await import(`./data/info/${command}`);
        const {
            command: commandStruct,
            extraInfo,
        } = commandData;
        if(!Object.values(CommandType).includes(extraInfo.type))
            throw new Error('Unknown command type');
        const loader = commandLoader[<CommandType> extraInfo.type];
        if(!loader)
            throw new Error('Command loader not found');
        const commandName =
            extraInfo.name ? extraInfo.name : command.split(path.extname(command))[0];
        loader(commandName, commandStruct);
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPostLoad,
};

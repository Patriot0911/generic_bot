import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import commandLoader from './data/commandsLoader';
import { SlashCommandBuilder } from 'discord.js';
import { CommandType, } from './data/constants';
import modClient from '@/modClient';
import fs from 'node:fs/promises';
import path from 'node:path';

export default async function (_: modClient) {
    const commandsList = await fs.readdir(__dirname.concat('/data/info'));
    const globalCommands: SlashCommandBuilder[] = [];
    for(const command of commandsList) {
        if(path.extname(command) === '.map') // rework
            continue;
        try {
            const {
                default: commandData,
            } = await import(`./data/info/${command}`);
            const {
                command: commandStruct,
                extraInfo,
            } = commandData;
            if(!Object.values(CommandType).includes(extraInfo.type))
                throw new Error('Unknown command type');
            const commandToPut = commandStruct.toJSON(); // validate
            if(extraInfo.type === CommandType.GLOBAL) {
                globalCommands.push(commandToPut);
                continue;
            };
            const loader = commandLoader[<CommandType> extraInfo.type];
            if(!loader)
                throw new Error('Command loader not found');
            const guild = extraInfo.guild;
            await loader([commandToPut], guild); // rework
        } catch(e) {
            console.log(command);
        };
    };
    if(globalCommands.length < 1)
        return;
    const loader = commandLoader[CommandType.GLOBAL];
    await loader(globalCommands);
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPostLoad,
};

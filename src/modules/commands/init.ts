import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { ITempModules, TModuleContentInfo } from '@/types/client';
import commandLoader from './data/commandsLoader';
import { SlashCommandBuilder } from 'discord.js';
import { CommandType, } from './data/constants';
import modClient from '@/modClient';

export default async function (_: modClient, tempModules: ITempModules[]) {
    const globalCommands: SlashCommandBuilder[] = [];
    const addCommand = async (command: any) => {
        const {
            command: commandStruct,
            extraInfo,
        } = command;
        if(!Object.values(CommandType).includes(extraInfo.type))
            throw new Error('Unknown command type');
        const commandToPut = commandStruct.toJSON(); // validate
        if(extraInfo.type === CommandType.GLOBAL) {
            globalCommands.push(commandToPut);
            return;
        };
        const loader = commandLoader[<CommandType> extraInfo.type];
        if(!loader)
            throw new Error('Command loader not found');
        const guild = extraInfo.guild;
        await loader([commandToPut], guild); // rework

    };
    for(const module of tempModules) {
        const subModule = module.name.split(':')[0];
        if(subModule !== 'commands')
            continue;
        const commands = module.callback();
        if(!commands)
            continue;
        if(!Array.isArray(commands)) {
            addCommand(commands)
            continue;
        };
        for(const command of commands) {
            addCommand(command);
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
    event: ModuleExecuteEvents.OnModulesLoad,
};

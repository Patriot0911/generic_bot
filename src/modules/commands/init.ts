import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { ITempModules, TModuleContentInfo } from '@/types/client';
import commandLoader from './data/commandsLoader';
import { commandInteractions, CommandType, } from './data/constants';
import * as IModCommands from './data/types';
import { Collection, } from 'discord.js';
import modClient from '@/modClient';

interface ICommandClassInstance {
    new (): IModCommands.IModSlashCommand;
};

export default async function (_: modClient, tempModules: ITempModules[]) {
    const globalCommands: IModCommands.TShortCommandBody[] = [];
    const guildCommands = new Collection<string, IModCommands.TShortCommandBody[]>();
    const addCommand = async (command: IModCommands.IModSlashCommand) => {
        const {
            callback,
            commandInfo: {
                extraInfo,
                ...commandToPut
            },
        } = command;
        if(!Object.values(CommandType).includes(extraInfo.type))
            throw new Error('Unknown command type');
        commandInteractions.set(commandToPut.name, callback);
        if(extraInfo.type === CommandType.GLOBAL) {
            globalCommands.push(commandToPut);
            return;
        };
        const guildId = extraInfo.guild ?? (process.env.GUILD_ID as string);
        const prevGuildCommands = guildCommands.get(guildId);
        guildCommands.set(
            guildId, prevGuildCommands ? [...prevGuildCommands, commandToPut] : [commandToPut]
        );
    };
    for(const module of tempModules) {
        const subModule = module.name.split(':')[0];
        if(subModule !== 'commands')
            continue;
        const commands: ICommandClassInstance | ICommandClassInstance[] = module.callback();
        if(!commands)
            continue;
        if(!Array.isArray(commands)) {
            addCommand(new commands)
            continue;
        };
        for(const command of commands) {
            addCommand(new command);
        };
    };
    if(globalCommands.length > 0) {
        const globalLoader = commandLoader[CommandType.GLOBAL];
        await globalLoader(globalCommands);
    };
    const guildLoader = commandLoader[CommandType.GUILD];
    for(const [guildId, command] of guildCommands) {
        await guildLoader(command, guildId);
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandsInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

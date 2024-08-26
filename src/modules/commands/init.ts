import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { ITempModules, TModuleContentInfo } from '@/types/client';
import commandLoader from './data/commandsLoader';
import { Collection, SlashCommandBuilder } from 'discord.js';
import { CommandType, } from './data/constants';
import modClient from '@/modClient';

export default async function (_: modClient, tempModules: ITempModules[]) {
    const globalCommands: SlashCommandBuilder[] = [];
    const guildCommands = new Collection<string, any[]>();
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
        const guild = extraInfo.guild;
        const prevGuildCommands = guildCommands.get(guild);
        guildCommands.set(
            guild, prevGuildCommands ? [...prevGuildCommands, commandToPut] : [commandToPut]
        );

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
    const globalLoader = commandLoader[CommandType.GLOBAL];
    await globalLoader(globalCommands);
    const guildLoader = commandLoader[CommandType.GUILD];
    for(const [guildId, command] of guildCommands) {
        const targetGuild = guildId ?? process.env.GUILD_ID;
        await guildLoader(command, targetGuild);
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'commandInit',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnModulesLoad,
};

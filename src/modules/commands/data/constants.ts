import * as IModCommands from '@/modules/commands/data/types';
import { Collection, } from 'discord.js';

export enum CommandType {
    GUILD = 'guild',
    GLOBAL = 'global',
};

export const commandInteractions = new Collection<string, IModCommands.TCommandCallback>();

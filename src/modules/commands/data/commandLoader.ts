import { SlashCommandBuilder } from 'discord.js';
import { CommandType } from './constants';

const commandLoader = {
    [CommandType.GUILD]: (command: SlashCommandBuilder, name: string, guildId?: string) => {

    },
    [CommandType.GLOBAL]: (command: SlashCommandBuilder, name: string) => {

    },
};

export default commandLoader;

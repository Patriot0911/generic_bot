import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { CommandType } from './constants';

const commandsLoader = {
    [CommandType.GUILD]: async (commands: SlashCommandBuilder[], guildId?: string) => {
        const token = process.env.TOKEN;
        if(!token)
            throw new Error('Invalid token');
        const rest = new REST().setToken(token);
        const clientId = process.env.CLIENT_ID;
        if(!clientId)
            throw new Error('Invalid clientID');
        const guild = guildId ?? process.env.GUILD_ID;
        if(!guild)
            throw new Error('Invalid guild');
        const data = await rest.put(
            Routes.applicationGuildCommands(`${clientId}`, `${guild}`),
            { body: commands, },
        );
        return data;
    },
    [CommandType.GLOBAL]: async (commands: SlashCommandBuilder[]) => {
        const token = process.env.TOKEN;
        if(!token)
            throw new Error('Invalid token');
        const rest = new REST().setToken(token);
        const clientId = process.env.CLIENT_ID;
        if(!clientId)
            throw new Error('Invalid clientID');
        const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
        return data;
    },
};

export default commandsLoader;

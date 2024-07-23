import { SlashCommandBuilder } from "discord.js"
import { CommandType } from "../constants";

const command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('ping')
    .setNameLocalizations({
        'uk': 'test',
    });


export default {
    command,
    extraInfo: {
        type: CommandType.GUILD,
    },
};

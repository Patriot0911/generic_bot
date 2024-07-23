import { SlashCommandBuilder } from "discord.js"

const command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("ping")
    .setNameLocalizations({
        'uk': 'test',
    });


export default {
    command,
    extraInfo: {
        type: 'guild',
    },
};

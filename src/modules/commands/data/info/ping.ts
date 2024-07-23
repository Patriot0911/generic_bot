import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"
import { CommandType } from "../constants";

const command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Select a member and kick them.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);


export default {
    command,
    extraInfo: {
        type: CommandType.GUILD,
    },
};

import { CommandType } from "@/modules/commands/data/constants";
import { PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"

const command = new SlashCommandBuilder()
    .setName('twitch_manager')
    .setDescription('...')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export default {
    command,
    extraInfo: {
        type: CommandType.GLOBAL,
    },
};

import { CommandType } from "@/modules/commands/data/constants";
import { PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"

const command = new SlashCommandBuilder()
    .setName('list_notifications')
    .setDescription('List connected twitch notifications')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export default {
    command,
    extraInfo: {
        type: CommandType.GLOBAL,
    },
};

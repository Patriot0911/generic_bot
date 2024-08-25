import { CommandType } from "@/modules/commands/data/constants";
import { PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"

const command = new SlashCommandBuilder()
    .setName('delete_notification')
    .setDescription('Delete twitch notification for specifc channel')
    .addStringOption(
        stringOption =>
            stringOption.setName('name')
            .setDescription('Twitch Name')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);


export default {
    command,
    extraInfo: {
        type: CommandType.GLOBAL,
    },
};

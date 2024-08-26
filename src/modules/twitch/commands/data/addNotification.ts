import { CommandType } from "@/modules/commands/data/constants";
import { PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"

const command = new SlashCommandBuilder()
    .setName('add_notification')
    .setDescription('Add twitch notification for specifc channel')
    .addStringOption(
        stringOption =>
            stringOption.setName('name')
            .setDescription('Twitch Name')
            .setRequired(true)
    )
    .addChannelOption(
        channelOption =>
            channelOption.setName('channel')
            .setDescription('Channel')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);


export default {
    command,
    extraInfo: {
        type: CommandType.GLOBAL,
    },
};

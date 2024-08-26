import { CommandType } from "@/modules/commands/data/constants";
import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"

const command = new SlashCommandBuilder()
    .setName('add_guild')
    .setDescription('...')
    .addStringOption(
        stringOption =>
            stringOption.setName('guild_id')
            .setDescription('Guild id')
            .setRequired(true)
    )
    .addChannelOption(
        channelOption =>
            channelOption.setName('default_channel')
            .setDescription('Channel id')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);


export default {
    command,
    extraInfo: {
        type: CommandType.GLOBAL,
    },
};

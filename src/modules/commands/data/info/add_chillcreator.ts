import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"
import { CommandType, } from "../constants";

const command = new SlashCommandBuilder()
    .setName('add_chillcreator')
    .setDescription('Set up chill creator')
    .addChannelOption(
        channelOption =>
            channelOption.setName('channel')
            .setDescription('Select channel to set up a chill creator')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
    )
    .addNumberOption(
        numberOption =>
            numberOption.setName('limit')
            .setDescription('Set channel limits')
            .setMinValue(0)
            .setMaxValue(99)
            .setRequired(true)
    )
    .addStringOption(
        stringOption =>
            stringOption.setName('name')
            .setDescription('Set name for new channels')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);


export default {
    command,
    extraInfo: {
        type: CommandType.GUILD,
    },
};

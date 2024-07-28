import { CommandType } from "@/modules/commands/data/constants";
import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, } from "discord.js"

const command = new SlashCommandBuilder()
    .setName('addchillcreator')
    .setDescription('Set up chill creator')
    .addChannelOption(
        channelOption =>
            channelOption.setName('channel')
            .setDescription('Select channel to set up a chill creator')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
    )
    .addStringOption(
        stringOption =>
            stringOption.setName('name')
            .setDescription('Set name for new channels')
            .setRequired(true)
    )
    .addNumberOption(
        numberOption =>
            numberOption.setName('limit')
            .setDescription('Set channel limits')
            .setMinValue(0)
            .setMaxValue(99)
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);


export default {
    command,
    extraInfo: {
        type: CommandType.GLOBAL,
    },
};

import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, } from 'discord.js';
import { createTempVoice, isVoiceCreator, voiceServices } from '../data';
import { CommandType } from '@/modules/commands/data/constants';
import * as IModCommands from '@/modules/commands/data/types';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default (_: modClient) => class Command extends IModCommands.IModSlashCommand {
    async callback(interaction: ChatInputCommandInteraction, client: modClient) {
        const channel = interaction.options.getChannel('channel');
        const category = interaction.options.getChannel('category');
        const guild = interaction.guild;
        if(!channel || !guild)
            return interaction.reply({
                ephemeral: true,
                content: 'Something went wrong',
            });
        const channelId = channel.id;
        const guildId = guild.id;
        if(isVoiceCreator(guildId, channelId))
            return interaction.reply({
                ephemeral: true,
                content: 'Channel is already creator',
            });
        const channelName = interaction.options.getString('name');
        const limit = interaction.options.getNumber('limit') ?? 0;
        if(!channelName)
            return interaction.reply({
                ephemeral: true,
                content: 'Something went wrong with command args',
            });
        const guildState = client.guilds.cache.get(guildId);
        if(!guildState)
            return interaction.reply({
                ephemeral: true,
                content: 'Something went wrong with guilds def.',
            });
        const channelState = guildState.channels.cache.get(channelId);
        if(!channelState || channelState.type !== ChannelType.GuildVoice)
            return interaction.reply({
                ephemeral: true,
                content: 'Channel not found',
            });
        await voiceServices.addCreator(client, {
            channelId,
            channelName,
            catId: category?.id,
            guildId,
            limit,
        });
        if(!channelState) {
            voiceServices.deleteCreator(client, channelId, guildId);
            return interaction.reply({
                ephemeral: true,
                content: 'Channel interaction error',
            });
        };
        if(channelState && channelState.members.size > 0) {
            for(const [_, member] of channelState.members) {
                createTempVoice(client, channelState, guild, member);
            };
        };
        interaction.reply({
            ephemeral: true,
            content: 'Channel added successfully',
        });
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'addcreator',
        description: 'Set up temp voice creator',
        extraInfo: {
            type: CommandType.GLOBAL,
        },
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
        options: [
            {
                name: 'channel',
                required: true,
                description: 'Select channel to set up a voice creator',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildVoice,],
            },
            {
                name: 'name',
                required: true,
                description: 'Set name for new channels',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'limit',
                description: 'Set channel limits',
                max_value: 99,
                min_value: 0,
                type: ApplicationCommandOptionType.Number,
            },
            {
                name: 'category',
                description: 'Set channel category',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildCategory,],
            },
        ],
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'addVoiceCreator',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

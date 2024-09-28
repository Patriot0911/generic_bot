import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { CommandType } from '@/modules/commands/data/constants';
import { createTempChill } from '../data/voiceUpdateActions';
import { isChillCreator, chillServices } from '../data/utils';
import { ModuleContentTypes, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import * as IModCommands from '@/modules/commands/data/types';
import modClient from '@/modClient';

export default (_: modClient) => class Command extends IModCommands.IModSlashCommand {
    async callback(interaction: ChatInputCommandInteraction, client: modClient) {
        const channel = interaction.options.getChannel('channel');
        const guild = interaction.guild;
        if(!channel || !guild)
            return interaction.reply({
                ephemeral: true,
                content: 'Something went wrong',
            });
        const channelId = channel.id;
        const guildId = guild.id;
        if(isChillCreator(guildId, channelId))
            return interaction.reply({
                ephemeral: true,
                content: 'Channel is already chill creator',
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
        await chillServices.addCreator(client, {
            channelId,
            guildId,
            channelName,
            limit,
        });
        if(!channelState) {
            chillServices.deleteCreator(client, channelId, guildId);
            return interaction.reply({
                ephemeral: true,
                content: 'Channel interaction error',
            });
        };
        if(channelState && channelState.members.size > 0)
            createTempChill(client, channelState, guild);
        interaction.reply({
            ephemeral: true,
            content: 'Channel added successfully',
        });
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'addchillcreator',
        description: 'Set up chill creator',
        extraInfo: {
            type: CommandType.GLOBAL,
        },
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
        options: [
            {
                name: 'channel',
                required: true,
                description: 'Select channel to set up a chill creator',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildVoice],
            },
            {
                name: 'name',
                required: true,
                description: 'Set name for new channels',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'limit',
                required: true,
                description: 'Set channel limits',
                min_value: 0,
                max_value: 99,
                type: ApplicationCommandOptionType.Number,
            },
        ],
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'addChillCreator',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

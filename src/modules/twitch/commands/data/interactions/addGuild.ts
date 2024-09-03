import { TwitchGuildPerms } from '@/entities/twitch/twitchGuilds.entity';
import { ChannelType, ChatInputCommandInteraction, } from 'discord.js';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes } from '@/constants';
import { twitchGuild } from '@/entities/twitch';
import { TypeORMError } from 'typeorm';
import { addGuild, } from '..';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    if(!interaction.guildId)
        return interaction.reply({
            ephemeral: true,
            content: 'Cannot do this without guild',
        });
    const targetId = interaction.options.getString('guild_id');
    const channelId = interaction.options.getString('default_channel');
    if(!targetId)
        return interaction.reply({
            ephemeral: true,
            content: 'Guild id is required',
        });
    const channel = channelId && client.guilds.cache.get(targetId)?.channels.cache.get(channelId);
    if(!channelId || !channel || channel.type !== ChannelType.GuildText)
        return interaction.reply({
            ephemeral: true,
            content: 'Invalid default channel',
        });
    if(targetId === interaction.guildId)
        return interaction.reply({
            ephemeral: true,
            content: 'Access denied',
        });
    const guildRepository = client.dataSource.getRepository(twitchGuild);
    const guildData = await guildRepository.findOne({
        where: {
            guildId: interaction.guildId,
            permission: TwitchGuildPerms.ManageGuilds,
        },
    });
    if(!guildData)
        return interaction.reply({
            ephemeral: true,
            content: 'Access denied',
        });
    const targetGuildData = await guildRepository.findOne({
        where: {
            guildId: targetId,
        }
    });
    if(!targetGuildData || !targetGuildData?.permission || targetGuildData?.permission === TwitchGuildPerms.None) {
        try {
            await guildRepository.upsert({
                    ...targetGuildData,
                    guildId: targetId,
                    defaultChannel: channelId,
                    permission: TwitchGuildPerms.Listen,
                },
                {
                    conflictPaths: ['guildId',],
                },
            );
            return interaction.reply({
                ephemeral: true,
                content: 'Guild added successfully',
            });
        } catch(e) {
            const error = <TypeORMError> e;
            return interaction.reply({
                ephemeral: true,
                content: error.message,
            });
        };
    };
    return interaction.reply({
        ephemeral: true,
        content: 'Already in use',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'add_guild',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = addGuild;

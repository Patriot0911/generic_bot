import { ApplicationCommandOptionType, PermissionFlagsBits, type ChatInputCommandInteraction, } from 'discord.js';
import twitchGuild, { TwitchGuildPerms } from '@/entities/twitch/twitchGuilds.entity';
import subscription from '@/entities/twitch/subscription.entity';
import { CommandType } from '@/modules/commands/data/constants';
import * as IModCommands from '@/modules/commands/data/types';
import TwitchService from '../data/services/TwitchService';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default (_: modClient) => class Command extends IModCommands.IModSlashCommand {
    async callback(interaction: ChatInputCommandInteraction, client: modClient) {
        if(!interaction.guildId)
            return interaction.reply({
                ephemeral: true,
                content: 'Cannot do this without guild',
            });
        const guildRepository = client.dataSource.getRepository(twitchGuild);
        const guildData = await guildRepository.findOne({
            where: {
                guildId: interaction.guildId,
            }
        });
        if(!guildData || !guildData?.permission || guildData?.permission === TwitchGuildPerms.None)
            return interaction.reply({
                ephemeral: true,
                content: 'Twitch activity is not allowed for this guild',
            });
        const streamerName = interaction.options.getString('name');
        if(!streamerName)
            return;
        const {
            data: userData,
            message: userMessage,
        } = await TwitchService.getStreamer(streamerName);
        if(userMessage)
            return interaction.reply({
                ephemeral: true,
                content: userMessage,
            });

        const subscriptionRepository = client.dataSource.getRepository(subscription);

        const curSub = await subscriptionRepository.findOne({
            where: {
                broadcaster_id: userData.id,
            },
            relations: {
                guilds: true,
            },
        });

        if(curSub) {
            const guildIdList = curSub.guilds ? curSub.guilds.map(item => item.guildId) : [];
            if(curSub.guilds && guildIdList.includes(guildData.guildId))
                return interaction.reply({
                    ephemeral: true,
                    content: 'Already in use',
                });
            const guilds = curSub.guilds ?  [...curSub.guilds, guildData] : [guildData];
            await subscriptionRepository.save({
                ...curSub,
                guilds,
            });
            return interaction.reply({
                ephemeral: true,
                content: 'Subscription added successfully',
            });
        };

        const { data, message, } = await TwitchService.callAddStreamer(userData.id);
        if(message)
            return interaction.reply({
                ephemeral: true,
                content: message,
            });
        const subData = subscriptionRepository.create({
            streamerName: userData.display_name,
            broadcaster_id: userData.id,
            subscriptionId: data?.user.id,
            guilds: [guildData,],
        });
        await subscriptionRepository.save(subData);
        return interaction.reply({
            ephemeral: true,
            content: `Success`,
        })
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'add_notification',
        description: 'Add twitch notification for specifc channel',
        extraInfo: {
            type: CommandType.GLOBAL,
        },
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
        options: [
            {
                name: 'name',
                description: 'Twitch Name',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'channel',
                description: 'Channel',
                type: ApplicationCommandOptionType.Channel,
            },
        ],
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'add_notification',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

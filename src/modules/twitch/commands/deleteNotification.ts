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
        const subId = interaction.options.getString('subscription_id');
        if(!subId)
            return;
        const { message: userMessage, } = await TwitchService.deleteSubscription(subId);
        // TODO
        const subscriptionRepository = client.dataSource.getRepository(subscription);
        await subscriptionRepository.delete({
            subscriptionId: subId,
        });
        if(userMessage)
            return interaction.reply({
                ephemeral: true,
                content: userMessage,
            });
        return interaction.reply({
            ephemeral: true,
            content: `Success`,
        })
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'delete_notification',
        description: 'Delete twitch notification for specifc channel',
        extraInfo: {
            type: CommandType.GUILD,
        },
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
        options: [
            {
                name: 'subscription_id',
                description: 'Subscription Id',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'delete_notification',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

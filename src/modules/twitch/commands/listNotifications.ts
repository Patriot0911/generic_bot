import { PermissionFlagsBits, type ChatInputCommandInteraction, } from 'discord.js';
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
        const { data: { data, } } = await TwitchService.getSubscriptionList();
        const subscriptionRepository = client.dataSource.getRepository(subscription);
        const subscriptions = await subscriptionRepository.find({
            where: {
                guilds: {
                    guildId: interaction.guildId,
                },
            },
        });
        const subIdList = data.filter((item: any) => item.status == 'enabled').map((item: any) => item.id);
        const mappedSubs = subscriptions.map(
            item => `${
                subIdList.includes(item.subscriptionId) ? ':green_circle:' : ':red_circle:'
            } ${item.streamerName}\n||[\`\`${item.subscriptionId}\`\`]||\n`,
        );
        interaction.reply({
            ephemeral: true,
            content: `List: \n${mappedSubs.toString()}`,
        });
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'list_notifications',
        description: 'List connected twitch notifications',
        extraInfo: {
            type: CommandType.GUILD,
        },
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'list_notifications',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

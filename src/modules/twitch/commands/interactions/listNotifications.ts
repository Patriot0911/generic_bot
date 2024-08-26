import subscription from '@/entities/twitch/subscription.entity';
import { ChatInputCommandInteraction } from 'discord.js';
import { TwitchService } from '../../data/services';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes } from '@/constants';
import { listNotifications, } from '../data';
import modClient from '@/modClient';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
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
    const subIdList = data.map((item: any) => item.id);
    const mappedSubs = subscriptions.map(
        item => `${
            subIdList.includes(item.subscriptionId) ? ':green_circle:' : ':red_circle:'
        } ${item.streamerName}\n||[\`\`${item.subscriptionId}\`\`]||`,
    );
    interaction.reply({
        ephemeral: true,
        content: `List: \n${mappedSubs.toString()}`,
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'list_notifications',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = listNotifications;

import { TwitchGuildPerms } from '@/entities/twitch/twitchGuilds.entity';
import deleteNotification from '../deleteNotification';
import { ChatInputCommandInteraction, } from 'discord.js';
import { TModuleContentInfo } from '@/types/client';
import { TwitchService } from '../../../data/services';
import { ModuleContentTypes } from '@/constants';
import { twitchGuild } from '@/entities/twitch';
import modClient from '@/modClient';
import subscription from '@/entities/twitch/subscription.entity';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
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

export const contentInfo: TModuleContentInfo = {
    name: 'delete_notification',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = deleteNotification;

import { EmbedBuilder, ModalSubmitInteraction, } from 'discord.js';
import notification from '@/entities/twitch/notification.entity';
import subscription from '@/entities/twitch/subscription.entity';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { TwitchService, } from '../data/services';
import modClient from '@/modClient';
import { twitchGuild } from '@/entities/twitch';

const isJSON = (arg: string) => {
    try {
        return !!JSON.parse(arg);
    } catch(e) {
        return false;
    };
};

const findSubscriptionOrCrate = async (client: modClient, streamerId: string, streamerName: string) => {
    const subscriptionRepository = client.dataSource.getRepository(subscription);
    const subscriptionData = await subscriptionRepository.findOne({
        where: {
            broadcaster_id: streamerId,
        },
    });
    if(!subscriptionData) {
        const newSubscription = subscriptionRepository.create({
            broadcaster_id: streamerId,
            streamerName: streamerName,
        });
        return subscriptionRepository.save(newSubscription);
    };
    return subscriptionData;
};

export default async function (interaction: ModalSubmitInteraction, client: modClient) {
    const guildId = interaction.guildId;
    const twitchTag = interaction.components[0].components[0].value;
    const webhook = interaction.components[1].components[0].value;
    const embed = interaction.components[2].components[0].value;
    const { data: streamer, } = await TwitchService.getStreamer(twitchTag);
    if(!streamer)
        return interaction.reply({
            ephemeral: true,
            content: 'Cannot find such streamer',
        });
    const validatedEmbed = isJSON(embed) && new EmbedBuilder(embed as any);
    if(embed && !validatedEmbed)
        return interaction.reply({
            ephemeral:  true,
            content: 'Invalid JSON embed',
        });
    const notificationRepository = client.dataSource.getRepository(notification);
    const subscriptionData = await findSubscriptionOrCrate(client, streamer.id, twitchTag);
    const isExistNotification = await notificationRepository.findOne({
        where: [{
            guild: {
                guildId,
            },
            subscription: {
                id: subscriptionData.id,
            },
            webhook,
        },],
    });
    if(isExistNotification)
        return interaction.reply({
            ephemeral: true,
            content: 'Notification is already exist',
        });
    const newNotification = notificationRepository.create({
        embed: validatedEmbed && validatedEmbed.toJSON(),
        webhook,
        subscription: {
            id: subscriptionData.id,
        },
        guild: {
            guildId,
        },
    });
    await notificationRepository.save(newNotification);
    const guildRepository = client.dataSource.getRepository(twitchGuild);
    const guildData = await guildRepository.findOne({
        where: {
            guildId,
        },
        select: {
            subscriptions: true,
        },
    })
    if(!guildData)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong with guild permissions',
        });
    if(guildData.subscriptions)
        guildData.subscriptions.push(subscriptionData);
    guildData.subscriptions = [
        subscriptionData,
    ];
    await guildRepository.save(guildData);
    return interaction.reply({
        ephemeral: true,
        content: 'Created Successfully',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'newTwitchNotification',
    subModule: 'modals',
    type: ModuleContentTypes.Load,
};

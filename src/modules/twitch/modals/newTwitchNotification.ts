import findSubscriptionOrCrate from '../data/utils/findSubscriptionOrCrate';
import notification from '@/entities/twitch/notification.entity';
import { subscription, twitchGuild, } from '@/entities/twitch';
import { ModalSubmitInteraction, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { TwitchService, } from '../data/services';
import modClient from '@/modClient';
import { isJSON } from '@/utils';

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
    const validatedEmbed = isJSON(embed) && embed.replaceAll(/\n/g,'');
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
        embed: validatedEmbed ? validatedEmbed : null,
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
        relations: {
            subscriptions: true,
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
    const subscriptionRepository = client.dataSource.getRepository(subscription);
    if(!subscriptionData.guilds)
        subscriptionData.guilds = [];
    subscriptionData.guilds.push(guildData);
    await subscriptionRepository.save(subscriptionData);
    if(!guildData.subscriptions) {
        guildData.subscriptions = [
            subscriptionData,
        ];
    } else {
        if(!guildData.subscriptions.find((item) => item.subscriptionId === subscriptionData.subscriptionId))
            guildData.subscriptions.push(subscriptionData);
    };
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

import { notification, twitchGuild, } from '@/entities/twitch';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { ButtonInteraction, } from 'discord.js';
import modClient from '@/modClient';

export default async function (interaction: ButtonInteraction, client: modClient) {
    const notificationId = interaction.customId.split('|')[1];
    const notificationRepository = client.dataSource.getRepository(notification);
    const guildRepository = client.dataSource.getRepository(twitchGuild);
    try {
        const selectedNotification = await notificationRepository.findOne({
            where: {
                id: notificationId,
            },
            select: {
                subscription: {
                    broadcaster_id: true,
                },
            },
            relations: {
                subscription: true,
            },
        });
        const guildNotificationsForThisSub = await notificationRepository.find({
            where: {
                guild: {
                    guildId: interaction.guildId,
                },
                subscription: {
                    broadcaster_id: selectedNotification.subscription.broadcaster_id,
                },
            },
        });
        if(guildNotificationsForThisSub && guildNotificationsForThisSub.length <= 1) {
            const guildData = await guildRepository.findOne({
                where: {
                    guildId: interaction.guildId,
                    notifications: {
                        id: notificationId,
                    },
                },
                select: {
                    subscriptions: true,
                    notifications: true,
                },
                relations: {
                    subscriptions: true,
                    notifications: true,
                },
            });
            if(guildData) {
                if(guildData.notifications) {
                    guildData.notifications = guildData.notifications.filter(
                        item => item.id !== notificationId
                    );
                };
                if(guildData.subscriptions) {
                    guildData.subscriptions = guildData.subscriptions.filter(
                        item => item.broadcaster_id !== selectedNotification.subscription.broadcaster_id
                    );
                };
                await guildRepository.save(guildData);
            };
        };
        if(selectedNotification)
            await notificationRepository.remove(selectedNotification);
        interaction.reply({
            ephemeral: true,
            content: 'Deleted Successfully',
        });
    } catch(e) {
        console.log(e);
        interaction.reply({
            ephemeral: true,
            content: 'Something went wrong',
        });
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'delete_notification',
    subModule: 'buttons',
    type: ModuleContentTypes.Load,
};

import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { notification } from '@/entities/twitch';
import { ButtonInteraction, } from 'discord.js';
import modClient from '@/modClient';

export default async function (interaction: ButtonInteraction, client: modClient) {
    const notificationId = interaction.customId.split('|')[1];
    const notificationRepository = client.dataSource.getRepository(notification);
    try {
        const selectedNotification = await notificationRepository.findOne({
            where: {
                id: notificationId,
            },
        });
        await notificationRepository.remove(selectedNotification);
        interaction.reply({
            ephemeral: true,
            content: 'Deleted Successfully',
        });
    } catch(e) {
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

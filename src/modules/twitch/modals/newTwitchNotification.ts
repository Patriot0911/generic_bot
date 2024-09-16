import { ModalSubmitInteraction, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';
import notification from '@/entities/twitch/notification.entity';
import subscription from '@/entities/twitch/subscription.entity';

export default function (interaction: ModalSubmitInteraction, client: modClient) {
    const notificationRepository = client.dataSource.getRepository(notification);
    const newNotification = notificationRepository.create();
    const fieldData = new Object();
    for(const item of interaction.components) {
        const inputField = item.components[0];
        const [fieldName, guildId] = inputField.customId.split('|');
        Object.assign(fieldData, {
            [fieldName]: inputField.value,
            guildId: guildId,
        });
    };
    const subscriptionRepository = client.dataSource.getRepository(subscription);
    subscriptionRepository.findOne({
        where: {
            
        }
    })
    console.log(fieldData);
    return interaction.reply({
        ephemeral: true,
        content: 'tested',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'newTwitchNotification',
    subModule: 'modals',
    type: ModuleContentTypes.Load,
};

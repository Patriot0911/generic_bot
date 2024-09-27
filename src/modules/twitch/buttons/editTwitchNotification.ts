import { ButtonInteraction, ComponentType, ModalBuilder, TextInputStyle, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { notification } from '@/entities/twitch';
import modClient from '@/modClient';

export default async function (interaction: ButtonInteraction, client: modClient) {
    const guildId = interaction.guildId;
    const notificationId = interaction.customId.split('|')[1];
    const notificationRepository = client.dataSource.getRepository(notification);
    const selectedNotification = await notificationRepository.findOne({
        where: {
            id: notificationId,
        },
    });
    if(!selectedNotification)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong',
        });
    const editNotificationModal = new ModalBuilder({
        title: 'Edit Twitch notification',
        custom_id: `editTwitchNotification|${notificationId}`,
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        label: 'Webhook',
                        required: false,
                        style: TextInputStyle.Short,
                        type: ComponentType.TextInput,
                        customId: `webhook|${guildId}`,
                        placeholder: 'Channel webhook',
                        value: selectedNotification.webhook ?? '',
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        label: 'Embed',
                        required: false,
                        customId: `embed|${guildId}`,
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Paragraph,
                        value: selectedNotification.embed ?? '',
                        placeholder: 'JSON Embed Object or Embed name if you already have a preset',
                    },
                ],
            },
        ],
    });
    return interaction.showModal(editNotificationModal);
};

export const contentInfo: TModuleContentInfo = {
    name: 'edit_notification',
    subModule: 'buttons',
    type: ModuleContentTypes.Load,
};

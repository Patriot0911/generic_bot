import { ButtonInteraction, ComponentType, ModalBuilder, TextInputStyle, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default function (interaction: ButtonInteraction, client: modClient) {
    const guildId = interaction.guildId;
    const createNotificationModal = new ModalBuilder({
        title: 'Add new Twitch notification',
        custom_id: 'newTwitchNotification',
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        label: 'Twitch Tag',
                        customId: `twitchTag|${guildId}`,
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'e.g: fixtea13',
                        minLength: 2,
                        maxLength: 20,
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        label: 'Webhook',
                        customId: `webhook|${guildId}`,
                        required: false,
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'Channel webhook',
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        label: 'Embed',
                        customId: `embed|${guildId}`,
                        required: false,
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Paragraph,
                        placeholder: 'JSON Embed Object or Embed name if you already have a preset',
                    },
                ],
            },
        ],
    });
    return interaction.showModal(createNotificationModal);
};

export const contentInfo: TModuleContentInfo = {
    name: 'add_twitch_notification',
    subModule: 'buttons',
    type: ModuleContentTypes.Load,
};

import { RoleSelectMenuInteraction, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { notification, } from '@/entities/twitch';
import modClient from '@/modClient';

export default async function (interaction: RoleSelectMenuInteraction, client: modClient) {
    const notificationRepository = client.dataSource.getRepository(notification);
    const notificationId = interaction.customId.split('|')[1];
    const roleId = interaction.values[0];
    if(!roleId) {
        try {
            const selectedNotification = await notificationRepository.update({
                id: notificationId,
            }, {
                roleToMention: null,
            });
            return interaction.reply({
                ephemeral: true,
                content: 'Updated Successfully',
            });
        } catch(e) {
            return interaction.reply({
                ephemeral: true,
                content: 'Something went wrong with notification',
            });
        };
    };
    const role = interaction.guild.roles.cache.get(roleId);
    if(!role)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong with role',
        });
    try {
        const selectedNotification = await notificationRepository.update({
            id: notificationId,
        }, {
            roleToMention: roleId,
        });
        interaction.reply({
            ephemeral: true,
            content: 'Updated Successfully',
        });
    } catch(e) {
        interaction.reply({
            ephemeral: true,
            content: 'Something went wrong with notification',
        });
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'roleToMentionTwitch',
    subModule: 'roleSelectors',
    type: ModuleContentTypes.Load,
};

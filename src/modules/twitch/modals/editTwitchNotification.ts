import notification from '@/entities/twitch/notification.entity';
import { ModalSubmitInteraction, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';
import { isJSON } from '@/utils';

export default async function (interaction: ModalSubmitInteraction, client: modClient) {
    const notificationId = interaction.customId.split('|')[1];
    const webhook = interaction.components[0].components[0].value;
    const embed = interaction.components[1].components[0].value;
    const validatedEmbed = isJSON(embed) && embed.replaceAll(/\n/g,'');
    if(embed && !validatedEmbed)
        return interaction.reply({
            ephemeral:  true,
            content: 'Invalid JSON embed',
        });
    const notificationRepository = client.dataSource.getRepository(notification);
    const notificationData = await notificationRepository.findOne({
        where: {
            id: notificationId,
        },
    });
    if(!notificationData)
        return interaction.reply({
            ephemeral: true,
            content: 'Cannot find notification',
        });
    notificationData.embed = validatedEmbed ? validatedEmbed : null;
    notificationData.webhook = webhook;
    await notificationRepository.save(notificationData);
    return interaction.reply({
        ephemeral: true,
        content: 'Updated Successfully',
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'editTwitchNotification',
    subModule: 'modals',
    type: ModuleContentTypes.Load,
};

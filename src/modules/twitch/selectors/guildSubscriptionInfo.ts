import { APIEmbed, StringSelectMenuInteraction, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { notification } from '@/entities/twitch';
import modClient from '@/modClient';

export default async function (interaction: StringSelectMenuInteraction, client: modClient) {
    const guildId = interaction.guildId;
    const broadcaster_id = interaction.values[0];
    const notificationRepository = client.dataSource.getRepository(notification);
    const subNotifications = await notificationRepository.find({
        where: {
            subscription: {
                broadcaster_id,
            },
            guild: {
                guildId,
            },
        },
        relations: {
            subscription: true,
        },
        select: {
            subscription: {
                streamerName: true,
            },
        },
    });
    if(!subNotifications || subNotifications.length < 1)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong',
        });
    const description = subNotifications.map(
        (notification) =>
            `:purple_circle: **${
                notification.subscription.streamerName
            }** ${
                notification.id
            }\n> \`\`Embed:\`\` ${!!notification.embed}\n> \`\`WebHook:\`\`${!!notification.webhook}`
    ).join('\n\n')
    const embed: APIEmbed = {
        title: 'Subscription notifications',
        color: 15342579,
        description,
    }
    interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'select_twitch_notification',
    subModule: 'stringSelectors',
    type: ModuleContentTypes.Load,
};

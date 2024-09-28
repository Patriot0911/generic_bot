import { ActionRowBuilder, APIEmbed, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, } from 'discord.js';
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
    const getCircle = (index: number) => index % 2 != 0 ? '🟣' : '🟢';
    const description = subNotifications.map(
        (notification, index) =>
            `${getCircle(index)} **${
                notification.subscription.streamerName
            }** ${
                notification.id
            }\n> \`\`Embed:\`\` ${!!notification.embed}\n> \`\`WebHook:\`\`${!!notification.webhook}`
    ).join('\n\n');
    const embed: APIEmbed = {
        title: 'Subscription notifications',
        color: 15342579,
        description,
        image: {
            url: 'https://i.postimg.cc/vH2P24FT/image-54.png',
        },
        timestamp: new Date().toISOString(),
    };
    const selector = new StringSelectMenuBuilder()
    .setCustomId('manage_twitch_notification')
    .setMaxValues(1)
    .setPlaceholder('Select notification to manage')
    .addOptions([
        ...subNotifications.map(
            (notification, index) => new StringSelectMenuOptionBuilder({
                label: `${notification.id}`,
                emoji: getCircle(index),
                description: `Embed: ${!!notification.embed} <|> WebHook: ${!!notification.webhook}`,
                value: `${notification.id}`,
            })
        )
    ]);
    const componentRow = new ActionRowBuilder<StringSelectMenuBuilder>();
    componentRow.addComponents(selector);
    interaction.reply({
        embeds: [embed],
        components: [componentRow],
        ephemeral: true,
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'select_twitch_subscription',
    subModule: 'stringSelectors',
    type: ModuleContentTypes.Load,
};

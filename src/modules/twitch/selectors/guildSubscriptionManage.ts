import { ActionRowBuilder, APIEmbed, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder, StringSelectMenuInteraction, } from 'discord.js';
import { TModuleContentInfo, } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { notification } from '@/entities/twitch';
import modClient from '@/modClient';

export default async function (interaction: StringSelectMenuInteraction, client: modClient) {
    const guildId = interaction.guildId;
    const notificationId = interaction.values[0];
    const notificationRepository = client.dataSource.getRepository(notification);
    const selectedNotification = await notificationRepository.findOne({
        where: {
            id: notificationId,
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
    if(!selectedNotification)
        return interaction.reply({
            ephemeral: true,
            content: 'Something went wrong',
        });
    const { subscription, channelId, embed: embedData, webhook, roleToMention, } = selectedNotification;
    const description =
        `**ID:** ${
            notificationId
        }\n\`\`Streamer:\`\` ${
            subscription.streamerName
        }\n\`\`Channel to send:\`\` <#${
            channelId
        }>\n\`\`Embed:\`\` ${!!embedData}\n\`\`WebHook:\`\`${!!webhook}`;
    const embed: APIEmbed = {
        title: 'Notification Manager',
        color: 15342579,
        description,
        image: {
            url: 'https://i.postimg.cc/vH2P24FT/image-54.png',
        },
        timestamp: new Date().toISOString(),
    };
    const componentRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
        new ButtonBuilder({
            custom_id: `edit_notification|${notificationId}`,
            label: 'Edit',
            style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
            custom_id: `delete_notification|${notificationId}`,
            label: 'Delete',
            style: ButtonStyle.Danger
        }),
    ]);
    const selectedRole = roleToMention ? interaction.guild.roles.cache.get(roleToMention) : null;
    const roleSelector = new RoleSelectMenuBuilder();
    roleSelector.setCustomId(`roleToMentionTwitch|${notificationId}`);
    roleSelector.setMaxValues(1);
    roleSelector.setMinValues(0);
    if(selectedRole)
        roleSelector.setDefaultRoles([selectedRole.id]);
    const selectorComponentRow = new ActionRowBuilder<RoleSelectMenuBuilder>()
    .addComponents([
        roleSelector,
    ]);
    interaction.reply({
        embeds: [embed],
        components: [
            componentRow, selectorComponentRow
        ],
        ephemeral: true,
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'manage_twitch_notification',
    subModule: 'stringSelectors',
    type: ModuleContentTypes.Load,
};

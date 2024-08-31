import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    StringSelectMenuBuilder,
     StringSelectMenuOptionBuilder,
    } from 'discord.js';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes } from '@/constants';
import modClient from '@/modClient';
import { twitchGuild } from '@/entities/twitch';
import { Not } from 'typeorm';
import { TwitchGuildPerms } from '@/entities/twitch/twitchGuilds.entity';
import manager from '../data/manager';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    if(!interaction.guildId)
        return;
    const embed = {
        title: 'Notification Manager',
        description: `1`,
        image: {
            url: 'https://i.postimg.cc/vH2P24FT/image-54.png',
        },
    };
    const guildRepository = client.dataSource.getRepository(twitchGuild);
    const guildData = await guildRepository.findOne({
        where: {
            guildId: interaction.guildId,
            permission: Not(TwitchGuildPerms.None),
        },
        relations: {
            subscriptions: true,
        },
    });
    if(!guildData)
        return;
    const buttonRow = new ActionRowBuilder<ButtonBuilder>();
    buttonRow.addComponents(
        new ButtonBuilder()
        .setCustomId('add_twitch_notification')
        .setLabel('Add Notification')
        .setStyle(ButtonStyle.Success)
    );
    const selectorRow = new ActionRowBuilder<StringSelectMenuBuilder>();
    const notificationSelector = new StringSelectMenuBuilder()
        .setCustomId('select_twitch_notification')
        .setMaxValues(1)
        .setDisabled(guildData.subscriptions.length < 1)
    if(guildData.subscriptions.length > 1) {
        for(const sub of guildData.subscriptions) {
            const option = new StringSelectMenuOptionBuilder({
                label: sub.streamerName,
                value: sub.broadcaster_id,
                description: sub.subscriptionId,
            });
            notificationSelector.addOptions(option);
        };
    } else {
        notificationSelector.addOptions({
            default: true,
            label: 'Notifications not found',
            value: '0',
        });
    };
    selectorRow.addComponents(notificationSelector);
    interaction.reply({
        ephemeral: true,
        components: [
            buttonRow,
            selectorRow,
        ],
        embeds: [embed],
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitch_manager',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = manager;

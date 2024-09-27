import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type ChatInputCommandInteraction, } from 'discord.js';
import { TwitchGuildPerms } from '@/entities/twitch/twitchGuilds.entity';
import { CommandType } from '@/modules/commands/data/constants';
import * as IModCommands from '@/modules/commands/data/types';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { twitchGuild } from '@/entities/twitch';
import modClient from '@/modClient';
import { Not } from 'typeorm';

export default (_: modClient) => class Command extends IModCommands.IModSlashCommand {
    async callback(interaction: ChatInputCommandInteraction, client: modClient) {
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
            select: {
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
            .setCustomId('select_twitch_subscription')
            .setMaxValues(1)
            .setDisabled(guildData.subscriptions.length < 1)
        if(guildData.subscriptions.length > 0) {
            const options: StringSelectMenuOptionBuilder[] = [];
            for(const sub of guildData.subscriptions) {
                const option = new StringSelectMenuOptionBuilder({
                    label: sub.streamerName,
                    value: sub.broadcaster_id,
                    description: sub.subscriptionId,
                });
                options.push(option);
            };
            notificationSelector.addOptions(options);
        } else {
            notificationSelector.addOptions({
                default: true,
                label: 'Notifications not found',
                value: '0',
            });
        };
        selectorRow.addComponents(notificationSelector);
        return interaction.reply({
            ephemeral: true,
            components: [
                buttonRow,
                selectorRow,
            ],
            embeds: [embed],
        });
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'twitch_manager',
        description: 'Twitch Notification Manager',
        extraInfo: {
            type: CommandType.GLOBAL,
        },
        default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitchManager',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

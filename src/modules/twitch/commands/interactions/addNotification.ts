import { ChatInputCommandInteraction, } from 'discord.js';
import { addNotification, } from '../data';
import { TModuleContentInfo } from '@/types/client';
import { TwitchService } from '../../data/services';
import { ModuleContentTypes } from '@/constants';
import modClient from '@/modClient';
import subscription from '@/entities/twitch/subscription.entity';

export default async function (interaction: ChatInputCommandInteraction, client: modClient) {
    const streamerName = interaction.options.getString('name');
    if(!streamerName)
        return;
    const {
        data: userData,
        message: userMessage,
    } = await TwitchService.getStreamer(streamerName);
    if(userMessage)
        return interaction.reply({
            ephemeral: true,
            content: userMessage,
        });

    console.log(userData);

    // check & create new guild if it is nes-ry.

    const { data, message, } = await TwitchService.callAddStreamer(userData.id);
    console.log({
        data: data.data,
    });
    if(message)
        return interaction.reply({
            ephemeral: true,
            content: message,
        });

    const subscriptionRepository = client.dataSource.getRepository(subscription);

    const subData = subscriptionRepository.create({
        broadcaster_id: userData.id,
        subscriptionId: data.data[0].id, // add guild
    });
    const res = await subscriptionRepository.save(subData);
    console.log(res);
    return interaction.reply({
        ephemeral: true,
        content: `Success`,
    })
};

export const contentInfo: TModuleContentInfo = {
    name: 'add_notification',
    subModule: 'commands',
    type: ModuleContentTypes.Load,
};

export const commandInfo = addNotification;

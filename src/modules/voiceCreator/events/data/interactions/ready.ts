import { createTempVoice, voiceServices, } from '@/modules/voiceCreator/data';
import { voiceCreator, voiceTemp, } from '@/entities/voiceCreator';
import { Client, } from 'discord.js';
import modClient from '@/modClient';

export default async function (cl: Client) {
    const client = <modClient> cl;
    const creatorsRepository = client.dataSource.getRepository(voiceCreator);
    const tempRepository = client.dataSource.getRepository(voiceTemp);
    const temps = await tempRepository.find();
    if(temps.length > 0) {
        for(const item of temps) {
            const guild = client.guilds.cache.get(item.guildId);
            if(guild) {
                const channel = guild.channels.cache.get(item.channelId);
                if(channel && channel.isVoiceBased() && channel.members.size > 0) {
                    voiceServices.addTemp(client, {
                        ownerId: channel.members.firstKey()!,
                        channelId: channel.id,
                        guildId: guild.id,
                    });
                    continue;
                };
                if(channel)
                    channel.delete();
            };
            voiceServices.deleteTemp(client, item.guildId, item.channelId);
        };
    };
    const creators = await creatorsRepository.find();
    if(creators.length > 0) {
        for(const item of creators) {
            const guild = client.guilds.cache.get(item.guildId);
            if(guild) {
                const channel = guild.channels.cache.get(item.channelId);
                if(channel && channel.isVoiceBased()) {
                    await voiceServices.addCreator(client, {
                        ...item,
                    });
                    if(channel.members.size > 0) {
                        for(const [_, member] of channel.members) {
                            createTempVoice(client, channel, guild, member);
                        };
                    };
                    continue;
                };
            };
            voiceServices.deleteCreator(client, item.guildId, item.channelId);
        };
    };
};

import chillCreator from '@/entities/chillCreator/chillCreator.entity';
import chillTemp from '@/entities/chillCreator/chillTemp.entity';
import { Client, ChannelType, } from 'discord.js';
import modClient from '@/modClient';
import { chillCreators } from '../utils/constants';
import { chillServices } from '../utils';
import { createTempChill } from '../voiceUpdateActions';

export default async function (cl: Client) {
    const client = <modClient> cl;
    const chillRepository = client.dataSource.getRepository(chillCreator);
    const chillTempRepository = client.dataSource.getRepository(chillTemp);
    const temps = await chillTempRepository.find();
    if(temps.length > 0) {
        for(const item of temps) {
            const guild = client.guilds.cache.get(item.guildId);
            if(guild) {
                const channel = guild.channels.cache.get(item.channelId);
                if(channel && channel.type === ChannelType.GuildVoice && channel.members.size > 0) {
                    chillServices.addTemp(client, {
                        channelId: channel.id,
                        guildId: guild.id,
                    });
                    continue;
                };
                if(channel)
                    channel.delete();
            };
            chillServices.deleteTemp(client, item.guildId, item.channelId);
        };
    };
    const creators = await chillRepository.find();
    if(creators.length > 0) {
        for(const item of creators) {
            const guild = client.guilds.cache.get(item.guildId);
            if(guild) {
                const channel = guild.channels.cache.get(item.channelId);
                if(channel && channel.type === ChannelType.GuildVoice) {
                    await chillServices.addCreator(client, {
                        ...item,
                    });
                    if(channel.members.size > 0)
                        createTempChill(client, channel, guild);
                    continue;
                };
            };
            chillServices.deleteCreator(client, item.guildId, item.channelId);
        };
    };
};

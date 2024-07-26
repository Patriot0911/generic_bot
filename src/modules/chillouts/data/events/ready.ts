import chillCreator from '@/entities/chillCreator.entity';
import chillTemp from '@/entities/chillTemp.entity';
import { Client, ChannelType, } from 'discord.js';
import modClient from '@/modClient';
import { chillCreators } from '../utils/constants';

export default async function (cl: Client) {
    const client = <modClient> cl;
    const chillRepository = client.dataSource.getRepository(chillCreator);
    const chillTempRepository = client.dataSource.getRepository(chillTemp);
    const temps = await chillTempRepository.find();
    if(temps.length > 0) {
        for(const item of temps) {
            const guild = client.guilds.cache.get(item.guildId);
            if(!guild)
                continue; // delete from db
            const channel = guild.channels.cache.get(item.channelId);
            if(!channel || channel.type !== ChannelType.GuildVoice)
                continue; // delete from db
            if(channel.members.size > 0)
                continue; // add to collection
            await channel.delete('Chill temp channel');
        };
    };
    const creators = await chillRepository.find();
    if(creators.length > 0) {
        for(const item of creators) {
            const guild = client.guilds.cache.get(item.guildId);
            if(!guild)
                continue; // delete from db
            const channel = guild.channels.cache.get(item.channelId);
            if(!channel)
                continue; // delete from db
            chillCreators.set(`${item.guildId}:${item.channelId}`, {
                channelName: item.channelName,
                limit: item.limit,
                id: item.id,
            });
        };
    };
};

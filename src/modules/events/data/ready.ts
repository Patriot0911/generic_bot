import { chillCreators } from "@/modules/commands/data/constants";
import chillCreator from "@/entities/chillCreator.entity";
import chillTemp from "@/entities/chillTemp.entity";
import modClient from "@/modClient";
import { Client } from "discord.js";

declare module "gClient" {
    namespace gClient {
        interface ModClient {
            test2: string;
        }
    }
};

export default async function (cl: Client) {
    console.log('Ready for battle!');
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
            if(!channel)
                continue; // delete from db
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

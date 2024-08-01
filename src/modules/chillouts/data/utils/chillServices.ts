import { chillTemp, chillCreator, } from '@/entities/chillCreator';
import { chillCreators, chillTemps, } from './constants';
import modClient from '@/modClient';

const chillServices = {
    deleteCreator: (client: modClient, guildId: string, channelId: string) => {
        const creatorRepository = client.dataSource.getRepository(chillCreator);
        const key = `${guildId}:${channelId}`;
        const chillLocal = chillCreators.get(key);
        if(chillLocal)
            chillCreators.delete(key);
        return creatorRepository.delete({
            channelId,
            guildId,
        });
    },
    addCreator: (client: modClient, options: Omit<chillCreator, 'id'>) => {
        const creatorRepository = client.dataSource.getRepository(chillCreator);
        const tempRepository = client.dataSource.getRepository(chillTemp);
        const key = `${options.guildId}:${options.channelId}`;
        const chillTempLocal = chillTemps.get(key);
        if(chillTempLocal) {
            chillTemps.delete(key);
            tempRepository.delete({
                channelId: options.channelId,
                guildId: options.guildId,
            });
        };
        const chillCreatorLocal = chillCreators.get(key);
        if(!chillCreatorLocal)
            chillCreators.set(key, options);
        return creatorRepository.upsert({
                ...options,
            },
            {
                conflictPaths: ['channelId', 'guildId'],
            },
        );
    },
    deleteTemp: (client: modClient, guildId: string, channelId: string) => {
        const tempRepository = client.dataSource.getRepository(chillTemp);
        const key = `${guildId}:${channelId}`;
        const chillTempLocal = chillTemps.get(key);
        if(chillTempLocal)
            chillTemps.delete(key);
        return tempRepository.delete({
            channelId,
            guildId,
        });
    },
    addTemp: (client: modClient, options: Omit<chillTemp, 'id'>) => {
        const tempRepository = client.dataSource.getRepository(chillTemp);
        const creatorRepository = client.dataSource.getRepository(chillCreator);
        const key = `${options.guildId}:${options.channelId}`;
        const chillTempLocal = chillTemps.get(key);
        if(!chillTempLocal)
            chillTemps.set(key, key);
        const chillCreatorLocal = chillCreators.get(key);
        if(chillCreatorLocal) {
            chillCreators.delete(key);
            creatorRepository.delete({
                channelId: options.channelId,
                guildId: options.guildId,
            });
        };
        return tempRepository.upsert({
                ...options,
            },
            {
                conflictPaths: ['channelId', 'guildId'],
            },
        );
    },
};

export default chillServices;

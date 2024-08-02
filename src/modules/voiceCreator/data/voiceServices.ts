import { IVoiceTempOptions, voiceCreators, voiceTemps, } from './constants';
import { voiceCreator, voiceTemp, } from '@/entities/voiceCreator';
import modClient from '@/modClient';

const voiceServices = {
    addCreator: (client: modClient, options: Omit<voiceCreator, 'id'>) => {
        const creatorRepository = client.dataSource.getRepository(voiceCreator);
        const tempRepository = client.dataSource.getRepository(voiceTemp);
        const key = `${options.guildId}:${options.channelId}`;
        const voiceTempLocal = voiceTemps.get(key);
        if(voiceTempLocal) {
            voiceTemps.delete(key);
            tempRepository.delete({
                channelId: options.channelId,
                guildId: options.guildId,
            });
        };
        const voiceCreatorLocal = voiceCreators.get(key);
        if(!voiceCreatorLocal)
            voiceCreators.set(key, options);
        return creatorRepository.upsert({
                ...options,
            },
            {
                conflictPaths: ['channelId', 'guildId'],
            },
        );
    },
    deleteCreator: (client: modClient, guildId: string, channelId: string) => {
        const creatorRepository = client.dataSource.getRepository(voiceCreator);
        const key = `${guildId}:${channelId}`;
        const chillLocal = voiceCreators.get(key);
        if(chillLocal)
            voiceCreators.delete(key);
        return creatorRepository.delete({
            channelId,
            guildId,
        });
    },
    addTemp: (client: modClient, options: IVoiceTempOptions) => {
        const tempRepository = client.dataSource.getRepository(voiceTemp);
        const creatorRepository = client.dataSource.getRepository(voiceCreator);
        const { channelId, guildId, ownerId, } = options;
        const key = `${guildId}:${channelId}`;
        const voiceTempLocal = voiceTemps.get(key);
        if(!voiceTempLocal)
            voiceTemps.set(key, {
                ownerId: ownerId,
            });
        const voiceCreatorLocal = voiceCreators.get(key);
        if(voiceCreatorLocal) {
            voiceCreators.delete(key);
            creatorRepository.delete({
                channelId,
                guildId,
            });
        };
        return tempRepository.upsert({
                lastOwnerId: options.ownerId,
                channelId,
                guildId,
            },
            {
                conflictPaths: ['channelId', 'guildId'],
            },
        );
    },
    changeTempOwner: (client: modClient, guildId: string, channelId: string, ownerId: string) => {
        const tempRepository = client.dataSource.getRepository(voiceTemp);
        const key = `${guildId}:${channelId}`;
        const voiceTempLocal = voiceTemps.get(key);
        if(!voiceTempLocal)
            return;
        voiceTemps.set(key, {
            ownerId,
        });
        return tempRepository.upsert({
                channelId,
                guildId,
                lastOwnerId: ownerId,
            },
            {
                conflictPaths: ['channelId', 'guildId'],
            }
        );
    },
    deleteTemp: (client: modClient, guildId: string, channelId: string) => {
        const tempRepository = client.dataSource.getRepository(voiceTemp);
        const key = `${guildId}:${channelId}`;
        const voiceTempLocal = voiceTemps.get(key);
        if(voiceTempLocal)
            voiceTemps.delete(key);
        return tempRepository.delete({
            channelId,
            guildId,
        });
    },
};

export default voiceServices;

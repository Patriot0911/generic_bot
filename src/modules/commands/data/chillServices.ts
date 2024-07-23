import chillCreator from '@/entities/chillCreator.entity';
import chillTemp from '@/entities/chillTemp.entity';
import modClient from '@/modClient';

const chillServices = {
    changeCreator: async (client: modClient, oldChillId: number, chillOptions: Omit<chillCreator, 'id'>) => {
        const chillRepository = client.dataSource.getRepository(chillCreator);
        await chillRepository.delete({
            id: oldChillId,
        });
        return chillRepository.save({
            ...chillOptions,
        });
    },
    addCreator: async (client: modClient, chillOptions: Omit<chillCreator, 'id'>) => {
        const chillRepository = client.dataSource.getRepository(chillCreator);
        return chillRepository.save({
            ...chillOptions,
        });
    },
    deleteCreator: async (client: modClient, chillId: number) => {
        const chillRepository = client.dataSource.getRepository(chillCreator);
        return chillRepository.delete({
            id: chillId,
        });
    },
    addTempChill: async (client: modClient, chillOptions: Omit<chillTemp, 'id'>) => {
        const chillTempRepository = client.dataSource.getRepository(chillTemp);
        return chillTempRepository.save({
            ...chillOptions,
        });
    },
    deleteTempChill: async (client: modClient, chillId: number) => {
        const chillTempRepository = client.dataSource.getRepository(chillTemp);
        return chillTempRepository.delete({
            id: chillId,
        });
    },
};

export default chillServices;

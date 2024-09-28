import subscription from '@/entities/twitch/subscription.entity';
import { TwitchService, } from '../services';
import modClient from '@/modClient';

const createSubscription = async (streamerId: string) => {
    const { data: subscriptionData, } = await TwitchService.callAddStreamer(streamerId);
    return subscriptionData.user;
};

const findSubscriptionOrCrate = async (client: modClient, streamerId: string, streamerName: string) => {
    const subscriptionRepository = client.dataSource.getRepository(subscription);
    const subscriptionData = await subscriptionRepository.findOne({
        where: {
            broadcaster_id: streamerId,
        },
    });
    if(!subscriptionData) {
        const { data: listData, } = await TwitchService.getSubscriptionList();
        const subscriptionFromAPI = await listData.data.find( item => item.condition.broadcaster_user_id === streamerId);
        const subscriptionId = subscriptionFromAPI ? subscriptionFromAPI.id : (await createSubscription(streamerId)).id;
        const newSubscription = subscriptionRepository.create({
            subscriptionId,
            broadcaster_id: streamerId,
            streamerName: streamerName,
        });
        return subscriptionRepository.save(newSubscription);
    };
    return subscriptionData;
};

export default findSubscriptionOrCrate;

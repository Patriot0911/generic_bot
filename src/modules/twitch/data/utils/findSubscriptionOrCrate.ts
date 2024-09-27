import subscription from '@/entities/twitch/subscription.entity';
import modClient from '@/modClient';

const findSubscriptionOrCrate = async (client: modClient, streamerId: string, streamerName: string) => {
    const subscriptionRepository = client.dataSource.getRepository(subscription);
    const subscriptionData = await subscriptionRepository.findOne({
        where: {
            broadcaster_id: streamerId,
        },
    });
    if(!subscriptionData) {
        const newSubscription = subscriptionRepository.create({
            broadcaster_id: streamerId,
            streamerName: streamerName,
        });
        return subscriptionRepository.save(newSubscription);
    };
    return subscriptionData;
};

export default findSubscriptionOrCrate;

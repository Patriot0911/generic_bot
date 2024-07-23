import { chillCreators, } from './constants';

export default function (guildId: string, channelId: string) {
    return !!chillCreators.get(`${guildId}:${channelId}`);
};

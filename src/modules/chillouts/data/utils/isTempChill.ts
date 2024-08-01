import { chillTemps, } from './constants';

export default function (guildId: string, channelId: string) {
    return !!chillTemps.get(`${guildId}:${channelId}`);
};

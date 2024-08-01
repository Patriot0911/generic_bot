import { voiceTemps, } from '../constants';

export default function (guildId: string, channelId: string): boolean {
    return [...voiceTemps.keys()].includes(`${guildId}:${channelId}`);
};

import { voiceCreators, } from '../constants';

export default function (guildId: string, channelId: string): boolean {
    return [...voiceCreators.keys()].includes(`${guildId}:${channelId}`);
};

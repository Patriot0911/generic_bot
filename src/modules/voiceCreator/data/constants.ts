import { Collection, } from 'discord.js';

export interface IVoiceCreator {
    channelName: string;
    catId?: string;
    limit: number;
};

export interface IVoiceTemp {
    ownerId: string;
    // permissions?:
};

export interface IVoiceTempOptions extends IVoiceTemp {
    channelId: string;
    guildId: string;
};

/*
 *  key stands for
 * `${guildId}:${channelId}`
**/
export const voiceCreators = new Collection<string, IVoiceCreator>();
export const voiceTemps = new Collection<string, IVoiceTemp>();

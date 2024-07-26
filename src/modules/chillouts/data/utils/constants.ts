import { Collection, } from 'discord.js';

export interface IChillOptions {
    id: number;
    channelName: string;
    limit: number;
};

export const chillCreators = new Collection<string, IChillOptions>();
export const chillTemps = new Collection<string, number>();

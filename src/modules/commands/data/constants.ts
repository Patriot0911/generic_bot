import { Collection } from "discord.js";

export enum CommandType {
    GUILD = 'guild',
    GLOBAL = 'global',
};

export const chillCreators = new Collection();
export const chillTemps = new Collection<string, number>();

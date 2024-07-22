import { GatewayIntentBits } from 'discord.js';

export const basicModulesPath = './modules';

export enum ModuleContentTypes {
    Execute,
    Load,
};

export enum ModuleExecuteEvents {
    OnPreLoad = 'preLoaded',
    OnModulesLoad = 'modulesLoaded',
    OnDbLoad = 'dbLoaded',
    OnPostLoad = 'postLoaded',
};

export const moduleDataName = 'data';

export const intents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildInvites,
];

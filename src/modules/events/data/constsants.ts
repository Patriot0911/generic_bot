import { ComponentType, InteractionType, } from 'discord.js';

export const componentInteractions = {
    [ComponentType.Button]: 'buttons',
    [ComponentType.RoleSelect]: 'roleSelectors',
    [ComponentType.UserSelect]: 'userSelectors',
    [ComponentType.StringSelect]: 'stringSelectors',
    [ComponentType.ChannelSelect]: 'channelSelectors',
    [ComponentType.MentionableSelect]: 'mentionableSelectors',
};

export const availableInteractions= [
    InteractionType.MessageComponent,
    InteractionType.ModalSubmit,
];

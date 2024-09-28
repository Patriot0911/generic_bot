import { CommandInteraction, RESTPostAPIApplicationGuildCommandsJSONBody, } from 'discord.js';
import { CommandType } from './constants';
import modClient from '@/modClient';

export type TCommandInfo = {
    extraInfo: {
        type: CommandType;
        guild?: string;
    },
} & RESTPostAPIApplicationGuildCommandsJSONBody;

export type TShortCommandBody = RESTPostAPIApplicationGuildCommandsJSONBody;

export  type TCommandCallback = (interaction: CommandInteraction, client: modClient) => any;

export abstract class IModSlashCommand {
    abstract callback(interaction: CommandInteraction, client: modClient): any;

    abstract commandInfo: TCommandInfo;
}

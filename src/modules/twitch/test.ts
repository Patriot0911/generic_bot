import type { ChatInputCommandInteraction, } from 'discord.js';
import { CommandType } from '@/modules/commands/data/constants';
import * as IModCommands from '../commands/data/types';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default (_: modClient) => class Command extends IModCommands.IModSlashCommand {
    callback(interaction: ChatInputCommandInteraction, _: modClient) {
        return interaction.reply({
            ephemeral: true,
            content: 'tested',
        })
    };

    commandInfo: IModCommands.TCommandInfo = {
        name: 'test',
        description: 'des',
        extraInfo: {
            type: CommandType.GLOBAL,
        },
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'testCommand',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

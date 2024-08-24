import * as addNotification from './commands/interactions/addNotification';
import * as listNotifications from './commands/interactions/listNotifications';
import { ModuleContentTypes, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';

export default function (_: modClient) {
    return [
        addNotification.commandInfo,
        listNotifications.commandInfo,
    ];
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitchCommands',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

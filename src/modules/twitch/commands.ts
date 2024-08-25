import { commandInfo as deleteNotifications} from './commands/interactions/deleteNotification';
import { commandInfo as listNotifications} from './commands/interactions/listNotifications';
import { commandInfo as addNotification } from './commands/interactions/addNotification';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default function (_: modClient) {
    return [
        addNotification,
        listNotifications,
        deleteNotifications,
    ];
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitchCommands',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

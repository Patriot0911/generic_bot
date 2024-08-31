import { commandInfo as deleteNotifications} from './interactions/deleteNotification';
import { commandInfo as listNotifications} from './interactions/listNotifications';
import { commandInfo as addNotification } from './interactions/addNotification';
import { commandInfo as addGuild } from './interactions/addGuild';
import { commandInfo as manager } from './interactions/manager';
import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import modClient from '@/modClient';

export default function (_: modClient) {
    return [
        addNotification,
        listNotifications,
        deleteNotifications,
        addGuild,
        manager,
    ];
};

export const contentInfo: TModuleContentInfo = {
    name: 'twitchCommands',
    subModule: 'commands',
    type: ModuleContentTypes.TempLoad,
};

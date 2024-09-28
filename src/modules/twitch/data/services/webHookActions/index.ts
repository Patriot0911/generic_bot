import notificationCallback from './notificationCallback';
import revocationCallback from './revocationCallback';
import { TwitchMessageTypes } from '../../constants';
import { Request } from 'express';

interface IReturn {
    status: number;
    data: any;
};

type TCallback = (req: Request) => Promise<IReturn>;

interface IWebHookActions {
    [TwitchMessageTypes.notification]: TCallback;
    [TwitchMessageTypes.revocation]: TCallback;
};

const webHookActions: IWebHookActions = {
    [TwitchMessageTypes.notification]:  notificationCallback,
    [TwitchMessageTypes.revocation]:    revocationCallback,
};

export default webHookActions;

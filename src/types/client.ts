import { ModuleContentTypes, ModuleExecuteEvents } from '@/constants';
import { ClientOptions } from 'discord.js';
import modClient from '@/modClient';

export interface IModClientOptions extends ClientOptions { };

interface IModuleBaseContentInfo {
    name: string;
};

interface IModuleExecuteContentInfo extends IModuleBaseContentInfo {
    type: ModuleContentTypes.Execute;
    event: ModuleExecuteEvents;
};

interface IModuleLoadContentInfo extends IModuleBaseContentInfo {
    type: ModuleContentTypes.Load;
    subModule?: string;
};

export type TModuleContentInfo = IModuleExecuteContentInfo | IModuleLoadContentInfo;

export type IExecuteCallback = (client: modClient) => void;
export type IModuleCallback = (...args: any) => void;

export interface IExecuteQueue {
    event: ModuleExecuteEvents;
    callback: IExecuteCallback;
};

export interface IParsedModules {
    name: string;
    callback: IModuleCallback;
};

import { ModuleContentTypes, ModuleExecuteEvents } from '@/constants';
import { Client, ClientOptions } from 'discord.js';
import modClient from '@/modClient';

export interface IModClientOptions extends ClientOptions { };

interface IModuleBaseContentInfo {
    name: string;
};

export interface IModuleTempLoadContentInfo extends IModuleBaseContentInfo {
    type: ModuleContentTypes.TempLoad;
    subModule?: string;
};

export interface IModuleExecuteContentInfo extends IModuleBaseContentInfo {
    type: ModuleContentTypes.Execute;
    event: ModuleExecuteEvents;
};

export interface IModuleLoadContentInfo extends IModuleBaseContentInfo {
    type: ModuleContentTypes.Load;
    subModule?: string;
};

export type TModuleContentInfo = IModuleExecuteContentInfo | IModuleLoadContentInfo | IModuleTempLoadContentInfo;

export type IExecuteCallback = (client: modClient) => void;
export type IModuleCallback = (...args: any) => void;

export interface IExecuteQueue {
    event: ModuleExecuteEvents;
    callback: IExecuteCallback;
};

export interface ITempModules {
    name: string;
    callback: IModuleCallback;
};

export interface IParsedModules {
    name: string;
    callback: IModuleCallback;
};

export declare namespace gClient {
    export class ModClient extends Client { }
};

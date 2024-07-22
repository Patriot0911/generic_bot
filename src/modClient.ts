import { IModClientOptions, IModuleCallback } from '@/types/client';
import modulesParser from '@/utils/modulesParser';
import { ModuleExecuteEvents } from '@/constants';
import { Client, Collection, } from 'discord.js';
import AppDataSource from '@/dbDataSource';
import EventEmitter from 'node:events';
import { DataSource } from 'typeorm';

class modClient extends Client {
    protected eventEmitter: EventEmitter;
    protected modules: Collection<string, IModuleCallback>;

    public dataSource: DataSource;

    constructor(options: IModClientOptions) {
        super(options);
        this.eventEmitter = new EventEmitter();
        this.modules = new Collection();
    };

    public getModulesList() {
        const keys = Array.from(this.modules.keys());
        const names = keys.map(item => item.split(':')[0]);
        const uniqNames = [...new Set(names)];
        return uniqNames;
    };

    public triggerEvent(eventName: ModuleExecuteEvents, ...args: any) {
        this.eventEmitter.emit(eventName, this, ...args);
    };

    protected async connectDb() {
        this.dataSource = await AppDataSource.initialize();
    };

    public async build() {
        const { executeQueue, modulesList, } = await modulesParser();
        for(const { event, callback, } of executeQueue) {
            this.eventEmitter.on(event, callback);
        };
        this.triggerEvent(ModuleExecuteEvents.OnPreLoad);
        for(const { name, callback, } of modulesList) {
            this.modules.set(name, callback);
        };
        this.triggerEvent(ModuleExecuteEvents.OnModulesLoad);
        this.connectDb();
        this.triggerEvent(ModuleExecuteEvents.OnDbLoad);
    };
};

export default modClient;

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

    public getModuleContentList(moduleName: string) {
        const keys = Array.from(this.modules.keys()).filter(
            module => module.startsWith(`${moduleName}:`)
        );
        const names = keys.map(item => item.split(':')[1]);
        return names;
    };

    public getModuleContentCollection(moduleName: string) {
        const moduleContent = Array.from(this.modules.entries()).filter(
            module => module[0].startsWith(`${moduleName}:`)
        );
        const mappedContent: [string, IModuleCallback][] = moduleContent.map(
            item => [
                item[0].split(':')[0],
                item[1]
            ]
        );
        const contentCollection = new Collection(mappedContent);
        return contentCollection;
    };

    public getModuleContent(moduleName: string, contentName: string) {
        const content = this.modules.get(moduleName.concat(':', contentName));
        return content;
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

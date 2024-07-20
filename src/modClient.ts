import { IModClientOptions, IModuleCallback } from '@/types/client';
import modulesParser from '@/utils/modulesParser';
import { ModuleExecuteEvents } from '@/constants';
import { Client, Collection, } from 'discord.js';
import EventEmitter from 'node:events';

class modClient extends Client {
    protected eventEmitter: EventEmitter;
    protected modules: Collection<string, IModuleCallback>;

    constructor(options: IModClientOptions) {
        super(options);
        this.eventEmitter = new EventEmitter();
        this.modules = new Collection();
    };

    async build() {
        const { executeQueue, modulesList, } = await modulesParser();
        for(const { name, callback, } of modulesList) {
            this.modules.set(name, callback);
        };
        for(const { event, callback, } of executeQueue) {
            this.eventEmitter.on(event, callback);
        };
        this.eventEmitter.emit(ModuleExecuteEvents.OnPreLoad, this);
    };
};

export default modClient;

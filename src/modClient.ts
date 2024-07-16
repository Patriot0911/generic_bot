import {
    Client,
} from 'discord.js';
import { IModClientOptions } from '@/types/client';
import modulesParser from '@/utils/modulesParser';

class modClient extends Client {
    constructor(options: IModClientOptions) {
        super(options);
    };

    async build() {
        const modules = await modulesParser();
        console.log(modules);
    };
};

export default modClient;

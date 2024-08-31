import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { ITempModules, TModuleContentInfo } from '@/types/client';
import modClient from '@/modClient';
import express from "express";

export default function (_: modClient, tempContent: ITempModules[]) {
    const app = express();
    const port = process.env.EXPRESS_PORT || 3000;

    for(const content of tempContent) {
        if(!content.name.startsWith('express:'))
            continue;
        const plugin = content.callback();
        const prefix = plugin.prefix ? `/${plugin.prefix}` : '/';
        app.use(prefix, plugin.data);
    };

    const listener = app.listen(port, () => {
        console.log(
            `Express app is listening to ${(listener.address() as any).port}`
        );
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'initExpressServer',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPreLoad,
};

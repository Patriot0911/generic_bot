import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { verifyTwitchSignature } from './data/utils';
import { TModuleContentInfo } from '@/types/client';
import routes from './data/controllers';
import modClient from '@/modClient';
import ngRok from './data/ngRok';
import express from "express";

declare global {
    namespace Express {
        export interface Request {
            client: modClient;
        }
    }
};

export default function (client: modClient) {
    const app = express();
    const port = process.env.EXPRESS_PORT || 3000;

    app.use(express.json({ verify: verifyTwitchSignature, }));
    app.use((req, _, next) => {
        req.client = client;
        next();
    });
    app.use(routes);

    ngRok(port);

    const listener = app.listen(port, () => {
        console.log(
            `Express app is listening to ${(listener.address() as any).port}`
        );
    });
};

export const contentInfo: TModuleContentInfo = {
    name: 'initEvents',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPreLoad,
};

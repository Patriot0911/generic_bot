import { TModuleContentInfo } from '@/types/client';
import { ModuleContentTypes, } from '@/constants';
import { NextFunction, Request } from 'express';
import modClient from '@/modClient';

declare global {
    namespace Express {
        export interface Request {
            client: modClient;
        }
    }
};

export default function (client: modClient) {
    const clientDecorator = (req: Request, _: Response, next: NextFunction) => {
        req.client = client;
        next();
    };

    return {
        data: clientDecorator,
    };
};

export const contentInfo: TModuleContentInfo = {
    name: 'client_decorator',
    subModule: 'express',
    type: ModuleContentTypes.TempLoad,
};

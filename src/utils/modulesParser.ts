import { modulesPath, ModuleContentTypes, moduleDataName, } from '@/constants';
import {
    IExecuteCallback,
    IExecuteQueue,
    IModuleCallback,
    IModuleExecuteContentInfo,
    IModuleLoadContentInfo,
    IModuleTempLoadContentInfo,
    IParsedModules,
    ITempModules,
} from '@/types/client';
import { pathToFileURL } from 'node:url';
import { glob } from 'glob';
import _path from 'node:path';

const modulesParser = async () => {
    const modulesList: IParsedModules[] = [],
        executeQueue: IExecuteQueue[] = [],
        tempContent: ITempModules[] = [];
    const contentActions = {
        [ModuleContentTypes.Execute]: (info: IModuleExecuteContentInfo, callback: IExecuteCallback) => executeQueue.push({
            event: info.event,
            callback,
        }),
        [ModuleContentTypes.Load]: (info: IModuleLoadContentInfo, callback: IModuleCallback, module: string) => modulesList.push({
            name: `${module}:${info.name}`,
            callback,
        }),
        [ModuleContentTypes.TempLoad]: (info: IModuleTempLoadContentInfo, callback: IModuleCallback, module: string) => tempContent.push({
            name: `${module}:${info.name}`,
            callback,
        }),
    };
    const beginPath = `src/${modulesPath}`;
    const moduleFilesList = await glob(`${beginPath}/**/*.{js,ts}`, {
        ignore: `${beginPath}/**/${moduleDataName}/**`,
    });
    for(const module of moduleFilesList) {
        const path = pathToFileURL(module);
        const fileContent = await import(path.toString());
        const {
            default: callback,
            contentInfo,
        } = fileContent;
        if(!contentInfo || !callback)
            throw new Error(
                `Module's content is invalid (Module: ${module})`
            );
        const type = <ModuleContentTypes> contentInfo.type;
        const action = contentActions[type];
        if(!action)
            continue;
        action(contentInfo, callback, contentInfo.subModule);
    };
    return {
        modulesList,
        executeQueue,
        tempContent,
    };
};

export default modulesParser;

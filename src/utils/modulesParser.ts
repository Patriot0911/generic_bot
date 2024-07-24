import { basicModulesPath, ModuleContentTypes, } from '@/constants';
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
import { isValidModuleFile, } from '@/validators';
import fs from 'node:fs/promises';

const modulesParser = async () => {
    const modulesList: IParsedModules[] = [],
        executeQueue: IExecuteQueue[] = [],
        tempContent: ITempModules[] = [];
    const contentActions = {
        [ModuleContentTypes.Execute]: (info: IModuleExecuteContentInfo, callback: IExecuteCallback) => executeQueue.push({
            event: info.event,
            callback,
        }),
        [ModuleContentTypes.Load]: (info: IModuleLoadContentInfo, callback: IModuleCallback) => modulesList.push({
            name: `${info.subModule ?? module}:${info.name}`,
            callback,
        }),
        [ModuleContentTypes.TempLoad]: (info: IModuleTempLoadContentInfo, callback: IModuleCallback) => tempContent.push({
            name: `${info.subModule ?? module}:${info.name}`,
            callback,
        }),
    };
    const rootPath =  __dirname.concat('/..');
    const moduleFilesList = await fs.readdir(`${rootPath}/${basicModulesPath}`);
    for(const module of moduleFilesList) {
        const path = basicModulesPath.concat('/', module);
        const filesList = await fs.readdir(`${rootPath}/${path}`);
        for(const file of filesList) {
            if(!isValidModuleFile(file))
                continue;
            const filePath = path.concat('/', file);
            const fileContent = await import(`../${filePath}`);
            const {
                default: callback,
                contentInfo,
            } = fileContent;
            if(!contentInfo || !callback)
                throw new Error(
                    `Module's content is invalid (Module: ${module} | Content: ${file})`
                );
            const type = <ModuleContentTypes> contentInfo.type;
            const action = contentActions[type];
            if(!action)
                continue;
            action(contentInfo, callback);
        };
    };
    return {
        modulesList,
        executeQueue,
        tempContent,
    };
};

export default modulesParser;

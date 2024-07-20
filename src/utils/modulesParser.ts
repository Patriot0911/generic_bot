import { basicModulesPath, ModuleContentTypes, moduleDataName } from '@/constants';
import { IExecuteQueue, IParsedModules, TModuleContentInfo } from '@/types/client';
import fs from 'node:fs/promises';
import path from 'path';

const modulesParser = async () => {
    const modulesList: IParsedModules[] = [],
        executeQueue: IExecuteQueue[] = [];
    const rootPath = path.resolve('./src');
    const moduleFilesList = await fs.readdir(`${rootPath}/${basicModulesPath}`);
    for(const module of moduleFilesList) {
        const path = basicModulesPath.concat('/', module);
        const filesList = await fs.readdir(`${rootPath}/${path}`);
        for(const file of filesList) {
            if(file === moduleDataName)
                continue;
            const filePath = path.concat('/', file);
            const fileContent = await import(`@/${filePath}`);
            const {
                default: callback,
                contentInfo,
            } = fileContent;
            if(!contentInfo || !callback)
                throw new Error(
                    `Module's content is invalid (Module: ${module} | Content: ${file})`
                );
            const info = <TModuleContentInfo> contentInfo;
            // validate Info
            if(info.type === ModuleContentTypes.Execute) {
                executeQueue.push({
                    event: info.event,
                    callback,
                });
            } else if(info.type === ModuleContentTypes.Load) {
                const contentModuleName = info.subModule ?? module;
                const contentName = `${contentModuleName}:${info.name}`;
                modulesList.push({
                    name: contentName,
                    callback,
                });
            };
        };
    };
    return {
        modulesList,
        executeQueue,
    };
};

export default modulesParser;

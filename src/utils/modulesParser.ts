import { basicModulesPath } from '@/constants';
import fs from 'node:fs/promises';
import path from 'path';

const modulesParser = async () => {
    const testArr = [];
    const rootPath = path.resolve('./src');
    const modulesList = await fs.readdir(`${rootPath}/${basicModulesPath}`);
    for(const module of modulesList) {
        const path = basicModulesPath.concat('/', module);
        const filesList = await fs.readdir(`${rootPath}/${path}`);
        for(const file of filesList) {
            const filePath = path.concat('/', file);
            const fileContent = await import(`@/${filePath}`);
            const {
                default: callback,
            } = fileContent;
            testArr.push(callback);
        };
    };
    return testArr;
};

export default modulesParser;

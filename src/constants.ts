export const basicModulesPath = './modules';

export enum ModuleContentTypes {
    Execute,
    Load,
};

export enum ModuleExecuteEvents {
    OnPreLoad = 'preLoaded',
    OnDbLoad = 'dbLoaded',
    OnPostLoad = 'postLoaded',
};

export const moduleDataName = 'data';

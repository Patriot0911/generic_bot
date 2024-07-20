import { ModuleContentTypes, } from "@/constants";
import { TModuleContentInfo } from "@/types/client";

export default function testFunc () {
    console.log('Hello world');
};

export const contentInfo: TModuleContentInfo = {
    name: 'testCommand',
    type: ModuleContentTypes.Load,
};

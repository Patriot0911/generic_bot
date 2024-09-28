import { ModuleContentTypes, ModuleExecuteEvents, } from '@/constants';
import { TModuleContentInfo } from '@/types/client';
import ngrok from 'ngrok';

export default async function () {
    const port = process.env.EXPRESS_PORT || 3000;
    const ngrokToken = process.env.NGROK_TOKEN;
    const ngrokHost = process.env.NGROK_HOST;
    console.log("Initializing Ngrok tunnel...");
    const url = await ngrok.connect({
        proto: "http",
        authtoken: ngrokToken,
        hostname: ngrokHost,
        addr: port,
    });
    console.log(`Listening on url ${url}`);
    console.log("Ngrok tunnel initialized!");
};

export const contentInfo: TModuleContentInfo = {
    name: 'initNgRokConnection',
    type: ModuleContentTypes.Execute,
    event: ModuleExecuteEvents.OnPostLoad,
};

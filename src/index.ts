import 'dotenv/config';
import 'reflect-metadata';
import modClient from '@/modClient';
import { intents, ModuleExecuteEvents } from '@/constants';

const client = new modClient({
    intents,
});

void async function loadClient() {
    try {
        await client.build();
        await client.login(process.env.TOKEN);
        client.triggerEvent(ModuleExecuteEvents.OnPostLoad);
    } catch(error: any) {
        console.error('[Initial Error accured]\n%s', error.message);
        process.exit();
    };
}();

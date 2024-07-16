import 'dotenv/config';
import fs from 'node:fs/promises';
import modClient from '@/modClient';
import { Collection } from 'discord.js';

const client = new modClient({
    intents: [],
});

void async function loadClient() {
    try {
        await client.build();
    //     await loadVoiceCreators(client);
    //     await parseInvites();
    //     await parsePhrases(client.lang ?? 'eng');
        await client.login(process.env.TOKEN);
    } catch(error: any) {
        console.error('[Initial Error accured]\n%s', error.message);
        process.exit();
    };
}();

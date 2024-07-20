import 'dotenv/config';
import modClient from '@/modClient';

const client = new modClient({
    intents: [],
});

void async function loadClient() {
    try {
        await client.build();
        await client.login(process.env.TOKEN);
    } catch(error: any) {
        console.error('[Initial Error accured]\n%s', error.message);
        process.exit();
    };
}();

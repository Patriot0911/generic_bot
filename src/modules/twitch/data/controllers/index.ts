import { Router } from 'express';
import callback from './callback';

const router = Router();

router.post('/webhooks/callback', callback);

export default router;

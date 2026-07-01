import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { listInvoices, getSubscription, payInvoice } from './billing.controller.js';

const router = Router();

router.get('/invoices', authenticate as any, listInvoices as any);
router.get('/subscription', authenticate as any, getSubscription as any);
router.post('/pay', authenticate as any, payInvoice as any);

export default router;

import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { aiRateLimiter } from '../../../middleware/rateLimiter.js';
import {
  handlePatientChat,
  handleMealPlanDraft,
  listConversations,
} from './ai.controller.js';

const router = Router();

// Secure Patient Educational Assistant routes
router.post('/', authenticate as any, aiRateLimiter as any, handlePatientChat as any);
router.get('/conversations', authenticate as any, listConversations as any);

// Secure Doctor AI Meal Plan Draft generator routes
router.post('/meal-draft', authenticate as any, aiRateLimiter as any, handleMealPlanDraft as any);

export default router;

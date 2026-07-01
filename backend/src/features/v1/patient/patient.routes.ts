import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import {
  getAllPatients,
  getMyPatients,
  updateMealPlan,
  logWater,
  addTimelineEvent,
  getTimelineEvents,
} from './patient.controller.js';

const router = Router();

router.get('/', authenticate as any, getAllPatients as any);
router.get('/my-patients', authenticate as any, getMyPatients as any);
router.put('/:id/mealplan', authenticate as any, updateMealPlan as any);
router.post('/:id/water', authenticate as any, logWater as any);
router.post('/:id/timeline', authenticate as any, addTimelineEvent as any);
router.get('/:id/timeline', authenticate as any, getTimelineEvents as any);

export default router;

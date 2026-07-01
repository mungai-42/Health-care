import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import {
  listAppointments,
  createAppointment,
  listHomeVisits,
  createHomeVisit,
  updateHomeVisitStatus,
} from './clinical.controller.js';

const router = Router();

router.get('/appointments', authenticate as any, listAppointments as any);
router.post('/appointments', authenticate as any, createAppointment as any);
router.get('/visits', authenticate as any, listHomeVisits as any);
router.post('/visits', authenticate as any, createHomeVisit as any);
router.put('/visits/:id/status', authenticate as any, updateHomeVisitStatus as any);

export default router;

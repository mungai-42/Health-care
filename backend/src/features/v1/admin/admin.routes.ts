import { Router } from 'express';
import { Role } from '../../../core/roles.js';
import {
  getPendingDoctors,
  approveDoctor,
  suspendUser,
  activateUser,
} from './admin.controller.js';
import { authenticate, authorize } from '../../../middleware/auth.js';

const router = Router();

// Apply auth + role guards to all admin routes
router.use(authenticate);
router.use(authorize(Role.ORG_ADMIN));

router.get('/doctors/pending', getPendingDoctors);
router.post('/doctors/:id/approve', approveDoctor);
router.post('/users/:id/suspend', suspendUser);
router.post('/users/:id/activate', activateUser);

export default router;

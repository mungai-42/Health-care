import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  me,
} from './auth.controller.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation.js';
import { validate } from '../../../middleware/validate.js';
import { authenticate } from '../../../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, me);

export default router;

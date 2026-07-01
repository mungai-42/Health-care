import { z } from 'zod';
import { Role } from '../../../core/roles.js';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Must be a valid email address' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Password must contain at least one letter and one number',
      }),
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }).trim(),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }).trim(),
    role: z.nativeEnum(Role).default(Role.PATIENT),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Must be a valid email address' }).trim(),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Verification token is required' }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Must be a valid email address' }).trim(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Reset token is required' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Password must contain at least one letter and one number',
      }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
  }),
});

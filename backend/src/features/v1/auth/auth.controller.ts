import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from '../../../core/roles.js';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { prisma } from '../../../config/db.js';
import { config } from '../../../config/config.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from '../../../core/errors.js';
import { logger } from '../../../core/logger.js';

// Helper to hash token string before db insertion (security best practice)
const hashSha256 = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Helper to generate access & refresh token pairs
const generateTokenPair = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRATION as any,
  });

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  
  // Calculate expiration date
  const parseExpiration = (expiryStr: string): Date => {
    const value = parseInt(expiryStr);
    const date = new Date();
    if (expiryStr.endsWith('d')) {
      date.setDate(date.getDate() + value);
    } else if (expiryStr.endsWith('h')) {
      date.setHours(date.getHours() + value);
    } else {
      // Default fallback 7 days
      date.setDate(date.getDate() + 7);
    }
    return date;
  };
  
  const expiresAt = parseExpiration(config.JWT_REFRESH_EXPIRATION);
  const tokenHash = hashSha256(rawRefreshToken);

  return { accessToken, rawRefreshToken, tokenHash, expiresAt };
};

export const register = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email address is already registered', 'EMAIL_TAKEN');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Bootstrapping rules:
    // 1. Patient: isApproved is true by default
    // 2. Doctor: isApproved is false by default (needs Admin approval)
    // 3. Org Admin: Check if an Admin already exists. If not, auto-approve to allow initial setup.
    let isApproved = false;

    if (role === Role.PATIENT) {
      isApproved = true;
    } else if (role === Role.ORG_ADMIN) {
      const activeAdmin = await prisma.user.findFirst({
        where: { role: Role.ORG_ADMIN, isApproved: true },
      });
      if (!activeAdmin) {
        logger.info('No approved ORG_ADMIN exists. Auto-approving the first admin account.');
        isApproved = true;
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        isApproved,
        isEmailVerified: true,
      },
    });

    // Create verification token (one-time use, expires in 24 hours)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashSha256(verificationToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.securityToken.create({
      data: {
        tokenHash,
        type: 'EMAIL_VERIFICATION',
        userId: user.id,
        expiresAt,
      },
    });

    // Healthcare security audit log
    logger.info(`User registered successfully: ${user.id} [${user.role}]`, { userId: user.id });

    // Print verification URL link to logger console for developer access
    const verifyUrl = `http://localhost:5000/api/v1/auth/verify-email?token=${verificationToken}`;
    logger.info(`[SMTP SIMULATION] Verification link for ${user.email}: ${verifyUrl}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email to activate your account.',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.query.token as string || req.body.token;
    if (!token) {
      throw new BadRequestError('Verification token is required', 'TOKEN_REQUIRED');
    }

    const tokenHash = hashSha256(token);
    const securityToken = await prisma.securityToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!securityToken || securityToken.type !== 'EMAIL_VERIFICATION') {
      throw new NotFoundError('Invalid verification token', 'INVALID_TOKEN');
    }

    if (securityToken.expiresAt < new Date()) {
      await prisma.securityToken.delete({ where: { id: securityToken.id } });
      throw new BadRequestError('Verification token has expired', 'TOKEN_EXPIRED');
    }

    await prisma.user.update({
      where: { id: securityToken.userId },
      data: { isEmailVerified: true },
    });

    // Delete verification token
    await prisma.securityToken.delete({ where: { id: securityToken.id } });

    logger.info(`Email verified for user: ${securityToken.userId}`);

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password credentials', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password credentials', 'INVALID_CREDENTIALS');
    }

    // Healthcare gate restrictions checks
    if (!user.isActive) {
      throw new ForbiddenError('Your account has been suspended by administration', 'ACCOUNT_SUSPENDED');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError('Please verify your email address before logging in', 'EMAIL_NOT_VERIFIED');
    }

    if (!user.isApproved) {
      throw new ForbiddenError('Your account is pending administrator approval', 'PENDING_APPROVAL');
    }

    // Generate tokens
    const { accessToken, rawRefreshToken, tokenHash, expiresAt } = generateTokenPair(
      user.id,
      user.role,
    );

    // Save refresh token hash in database
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    // Set refresh token as httpOnly secure cookie
    res.cookie('refreshToken', rawRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
    });

    logger.info(`User logged in successfully: ${user.id}`, { userId: user.id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken: rawRefreshToken, // also returned in body for clients/mobile apps
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required', 'REFRESH_TOKEN_REQUIRED');
    }

    const tokenHash = hashSha256(refreshToken);
    const dbToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!dbToken || dbToken.revoked) {
      // If a token is presented that is already revoked, it suggests a potential replay attack!
      // Revoke all refresh tokens for this user for security.
      if (dbToken) {
        await prisma.refreshToken.updateMany({
          where: { userId: dbToken.userId },
          data: { revoked: true },
        });
        logger.warn(`Potential refresh token reuse attack detected! Revoked all sessions for user: ${dbToken.userId}`);
      }
      throw new UnauthorizedError('Invalid refresh token or session revoked', 'INVALID_SESSION');
    }

    if (dbToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: dbToken.id } });
      throw new UnauthorizedError('Session has expired. Please log in again', 'SESSION_EXPIRED');
    }

    const user = dbToken.user;
    if (!user.isActive || !user.isEmailVerified || !user.isApproved) {
      throw new ForbiddenError('User session block restrictions active', 'SESSION_BLOCKED');
    }

    // Refresh Token Rotation: Revoke old token, generate and save new pair
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revoked: true },
    });

    const tokens = generateTokenPair(user.id, user.role);
    await prisma.refreshToken.create({
      data: {
        tokenHash: tokens.tokenHash,
        userId: user.id,
        expiresAt: tokens.expiresAt,
      },
    });

    // Update cookie
    res.cookie('refreshToken', tokens.rawRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: tokens.expiresAt,
    });

    res.status(200).json({
      success: true,
      message: 'Tokens rotated successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.rawRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (refreshToken) {
      const tokenHash = hashSha256(refreshToken);
      await prisma.refreshToken.deleteMany({ where: { tokenHash } });
    }

    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 even if email doesn't exist to prevent email enumeration attacks (security best practice)
      res.status(200).json({
        success: true,
        message: 'If the email matches an active account, a password reset link has been generated.',
      });
      return;
    }

    // Create password reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashSha256(resetToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Clean up any existing reset tokens
    await prisma.securityToken.deleteMany({
      where: { userId: user.id, type: 'PASSWORD_RESET' },
    });

    await prisma.securityToken.create({
      data: {
        tokenHash,
        type: 'PASSWORD_RESET',
        userId: user.id,
        expiresAt,
      },
    });

    // Print reset link to logger console for developer access
    const resetUrl = `http://localhost:5000/api/v1/auth/reset-password?token=${resetToken}`;
    logger.info(`[SMTP SIMULATION] Password Reset link for ${user.email}: ${resetUrl}`);

    res.status(200).json({
      success: true,
      message: 'If the email matches an active account, a password reset link has been generated.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const tokenHash = hashSha256(token);
    const securityToken = await prisma.securityToken.findUnique({
      where: { tokenHash },
    });

    if (!securityToken || securityToken.type !== 'PASSWORD_RESET') {
      throw new NotFoundError('Invalid reset token', 'INVALID_TOKEN');
    }

    if (securityToken.expiresAt < new Date()) {
      await prisma.securityToken.delete({ where: { id: securityToken.id } });
      throw new BadRequestError('Password reset token has expired', 'TOKEN_EXPIRED');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: securityToken.userId },
        data: { passwordHash },
      }),
      // Revoke all sessions since password has changed
      prisma.refreshToken.deleteMany({
        where: { userId: securityToken.userId },
      }),
      // Delete the reset token
      prisma.securityToken.delete({
        where: { id: securityToken.id },
      }),
    ]);

    logger.info(`Password reset successfully for user: ${securityToken.userId}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. All active sessions have been terminated. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        isApproved: req.user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

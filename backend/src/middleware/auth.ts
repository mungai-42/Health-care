import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Role } from '../core/roles.js';
import { config } from '../config/config.js';
import { prisma } from '../config/db.js';
import { UnauthorizedError, ForbiddenError } from '../core/errors.js';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

interface JwtPayload {
  userId: string;
  role: Role;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | null = null;

    // 1. Try to extract from Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Try to extract from Cookies (fallback)
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('Access token is missing', 'TOKEN_MISSING');
    }

    // Verify token signature
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED');
      }
      throw new UnauthorizedError('Invalid access token', 'TOKEN_INVALID');
    }

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User account not found', 'USER_NOT_FOUND');
    }

    // Assert account safety restrictions (healthcare security standards)
    if (!user.isActive) {
      throw new ForbiddenError('Your account has been suspended', 'ACCOUNT_SUSPENDED');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError('Please verify your email address', 'EMAIL_NOT_VERIFIED');
    }

    if (!user.isApproved) {
      throw new ForbiddenError(
        'Your account is pending administrator approval',
        'ACCOUNT_PENDING_APPROVAL',
      );
    }

    // Attach user profile to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('User is not authenticated', 'UNAUTHENTICATED'));
    }

    // Org Admin has full master access bypass (master access)
    if (req.user.role === Role.ORG_ADMIN) {
      return next();
    }

    // Validate role permissions
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          'You do not have permission to perform this action',
          'INSUFFICIENT_PERMISSIONS',
        ),
      );
    }

    next();
  };
};

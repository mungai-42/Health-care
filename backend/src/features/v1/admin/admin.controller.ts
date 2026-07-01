import { Response, NextFunction } from 'express';
import { Role } from '../../../core/roles.js';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { prisma } from '../../../config/db.js';
import { NotFoundError, BadRequestError } from '../../../core/errors.js';
import { logger } from '../../../core/logger.js';

export const getPendingDoctors = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: Role.ORG_DOCTOR,
        isApproved: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

export const approveDoctor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await prisma.user.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundError('Doctor account not found', 'DOCTOR_NOT_FOUND');
    }

    if (doctor.role !== Role.ORG_DOCTOR) {
      throw new BadRequestError('Target user is not a doctor', 'INVALID_TARGET_ROLE');
    }

    if (doctor.isApproved) {
      throw new BadRequestError('Doctor account is already approved', 'ALREADY_APPROVED');
    }

    await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });

    logger.info(`Doctor approved by admin: ${doctor.id} (Action by Admin: ${req.user?.id})`);

    res.status(200).json({
      success: true,
      message: 'Doctor account approved successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const suspendUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundError('User account not found', 'USER_NOT_FOUND');
    }

    if (targetUser.id === req.user?.id) {
      throw new BadRequestError('You cannot suspend your own account', 'SELF_SUSPENSION_BLOCKED');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { isActive: false },
      }),
      // Revoke all sessions instantly (healthcare compliance requirement)
      prisma.refreshToken.deleteMany({
        where: { userId: id },
      }),
    ]);

    logger.warn(`User account suspended by admin: ${targetUser.id} (Action by Admin: ${req.user?.id})`);

    res.status(200).json({
      success: true,
      message: 'User account has been suspended and all active sessions terminated.',
    });
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundError('User account not found', 'USER_NOT_FOUND');
    }

    if (targetUser.isActive) {
      throw new BadRequestError('User account is already active', 'ALREADY_ACTIVE');
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    logger.info(`User account activated by admin: ${targetUser.id} (Action by Admin: ${req.user?.id})`);

    res.status(200).json({
      success: true,
      message: 'User account has been reactivated.',
    });
  } catch (error) {
    next(error);
  }
};

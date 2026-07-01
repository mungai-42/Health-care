import { Response, NextFunction } from 'express';
import { prisma } from '../../../config/db.js';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { logger } from '../../../core/logger.js';

/**
 * Returns list of all patients (Admin view).
 */
export const getAllPatients = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patients = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        bloodPressure: true,
        heartRate: true,
        bloodSugar: true,
        mealPlan: true,
        waterTarget: true,
        waterDrank: true,
        assignedDoctorId: true,
      },
    });

    res.status(200).json({ success: true, patients });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns patients assigned to the logged-in doctor.
 */
export const getMyPatients = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const docId = req.user?.id;
    if (!docId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT',
        assignedDoctorId: docId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        bloodPressure: true,
        heartRate: true,
        bloodSugar: true,
        mealPlan: true,
        waterTarget: true,
        waterDrank: true,
      },
    });

    res.status(200).json({ success: true, patients });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a patient's meal diet plan.
 */
export const updateMealPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { mealPlan } = req.body;

    const patient = await prisma.user.update({
      where: { id },
      data: { mealPlan },
    });

    // Log timeline event
    await prisma.timelineEvent.create({
      data: {
        patientId: id,
        title: 'Meal Diet Plan Prescribed',
        description: `Diet prescribed: ${mealPlan.substring(0, 80)}...`,
        type: 'log',
      },
    });

    logger.info(`Meal plan updated for patient ${id} by practitioner: ${req.user?.id}`);
    res.status(200).json({ success: true, patient });
  } catch (error) {
    next(error);
  }
};

/**
 * Logs hydration increment.
 */
export const logWater = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const currentPatient = await prisma.user.findUnique({ where: { id } });
    if (!currentPatient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    const newDrank = (currentPatient.waterDrank || 0) + Number(amount);

    const patient = await prisma.user.update({
      where: { id },
      data: { waterDrank: newDrank },
    });

    // Check if hydration target is newly met
    const targetMet = newDrank >= (currentPatient.waterTarget || 2500) && (currentPatient.waterDrank || 0) < (currentPatient.waterTarget || 2500);
    if (targetMet) {
      await prisma.timelineEvent.create({
        data: {
          patientId: id,
          title: 'Hydration Target Achieved',
          description: `Successfully achieved 100% daily water target of ${currentPatient.waterTarget || 2500}mL.`,
          type: 'log',
        },
      });
    }

    res.status(200).json({ success: true, patient });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates timeline event.
 */
export const addTimelineEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;

    const event = await prisma.timelineEvent.create({
      data: {
        patientId: id,
        title,
        description,
        type,
      },
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetches patient timeline list history.
 */
export const getTimelineEvents = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const events = await prisma.timelineEvent.findMany({
      where: { patientId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

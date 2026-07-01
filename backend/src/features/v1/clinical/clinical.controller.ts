import { Response, NextFunction } from 'express';
import { prisma } from '../../../config/db.js';
import { AuthenticatedRequest } from '../../../middleware/auth.js';

/**
 * Lists clinical appointments.
 */
export const listAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let appts = await prisma.appointment.findMany({
      orderBy: { date: 'asc' },
    });

    // Seed mock appointments if database table is empty
    if (appts.length === 0) {
      const patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });
      const doctor = await prisma.user.findFirst({ where: { role: 'ORG_DOCTOR' } });

      if (patient && doctor) {
        await prisma.appointment.createMany({
          data: [
            {
              patientId: patient.id,
              patientName: `${patient.firstName} ${patient.lastName}`,
              doctorName: `${doctor.firstName} ${doctor.lastName}`,
              date: new Date(),
              time: '11:00 AM',
              status: 'Scheduled',
            },
            {
              patientId: patient.id,
              patientName: `${patient.firstName} ${patient.lastName}`,
              doctorName: `${doctor.firstName} ${doctor.lastName}`,
              date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              time: '09:00 AM',
              status: 'Scheduled',
            },
          ],
        });

        appts = await prisma.appointment.findMany({
          orderBy: { date: 'asc' },
        });
      }
    }

    res.status(200).json({ success: true, appointments: appts });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates clinical appointment booking.
 */
export const createAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { patientId, patientName, doctorName, date, time } = req.body;

    const appt = await prisma.appointment.create({
      data: {
        patientId,
        patientName,
        doctorName,
        date: new Date(date),
        time,
        status: 'Scheduled',
      },
    });

    res.status(201).json({ success: true, appointment: appt });
  } catch (error) {
    next(error);
  }
};

/**
 * Lists home dispatches visits.
 */
export const listHomeVisits = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let visits = await prisma.homeVisit.findMany({
      orderBy: { date: 'asc' },
    });

    // Seed mock visits if database table is empty
    if (visits.length === 0) {
      const patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });
      const doctor = await prisma.user.findFirst({ where: { role: 'ORG_DOCTOR' } });

      if (patient && doctor) {
        await prisma.homeVisit.createMany({
          data: [
            {
              patientId: patient.id,
              patientName: `${patient.firstName} ${patient.lastName}`,
              doctorName: `${doctor.firstName} ${doctor.lastName}`,
              date: new Date(),
              time: '04:00 PM',
              location: '12 Medical Plaza, Appt 4B',
              status: 'In Progress',
            },
            {
              patientId: patient.id,
              patientName: `${patient.firstName} ${patient.lastName}`,
              doctorName: `${doctor.firstName} ${doctor.lastName}`,
              date: new Date(Date.now() + 24 * 60 * 60 * 1000),
              time: '06:00 PM',
              location: '44 Garden Way, House 2',
              status: 'Assigned',
            },
          ],
        });

        visits = await prisma.homeVisit.findMany({
          orderBy: { date: 'asc' },
        });
      }
    }

    res.status(200).json({ success: true, homeVisits: visits });
  } catch (error) {
    next(error);
  }
};

/**
 * Dispatches a home visit.
 */
export const createHomeVisit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { patientId, patientName, doctorName, date, time, location } = req.body;

    const visit = await prisma.homeVisit.create({
      data: {
        patientId,
        patientName,
        doctorName,
        date: new Date(date),
        time,
        location,
        status: 'Assigned',
      },
    });

    res.status(201).json({ success: true, homeVisit: visit });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates dispatch status.
 */
export const updateHomeVisitStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const visit = await prisma.homeVisit.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, homeVisit: visit });
  } catch (error) {
    next(error);
  }
};

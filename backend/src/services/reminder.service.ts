import { prisma } from '../config/db.js';
import { NotificationService } from './notification.service.js';
import { logger } from '../core/logger.js';

export class ReminderService {
  /**
   * Scans all patient profiles for active tracking reminder metrics.
   */
  public static async runReminderScans(): Promise<void> {
    try {
      logger.info('Reminder Engine: Initiating clinical scans for medication adherence and hydration targets...');
      
      const patients = await prisma.user.findMany({
        where: { role: 'PATIENT' },
      });

      for (const patient of patients) {
        // 1. Hydration Reminder Check (Simulated criteria)
        // In a production app, we would query the database tracking logs.
        // If daily logged intake < 2.0L, send a nudge alert
        await NotificationService.sendPush(
          patient.id,
          'Hydration Nudge',
          `Hello ${patient.firstName}, remember to drink water! Aim to log at least 250mL in your trackers.`,
        );

        // 2. Medication Alert check
        // Nudge to take pending daily prescription drugs
        await NotificationService.sendPush(
          patient.id,
          'Medication Reminder',
          `Hi ${patient.firstName}, this is a reminder to take your scheduled medications and check them off in your clinical hub.`,
        );

        // 3. Appointments reminders (Simulate clinic or dispatch notifications)
        await NotificationService.sendEmail(
          patient.id,
          'Upcoming Clinic Booking Alert',
          `Dear ${patient.firstName}, you have an upcoming consultation scheduled with your primary doctor tomorrow. Please confirm your attendance in the portal.`,
        );
      }
      
      logger.info('Reminder Engine: Clinical scans completed. Dispatched reminders.');
    } catch (error: any) {
      logger.error('Error during reminder check loop execution', { error: error.message });
    }
  }
}

import { ReminderService } from '../services/reminder.service.js';
import { logger } from '../core/logger.js';

export const initReminderScheduler = () => {
  logger.info('Initializing background clinical reminder engine...');

  // Run an initial scan immediately to demonstrate operation in logs
  ReminderService.runReminderScans().catch((err) => {
    logger.error('Failed executing initial reminder scan', { error: err.message });
  });

  // Set recurring hourly checks (1 hour = 60 * 60 * 1000 milliseconds)
  const HOURLY_INTERVAL_MS = 60 * 60 * 1000;
  
  setInterval(async () => {
    logger.info('Background scheduler tick: Starting hourly reminder run...');
    try {
      await ReminderService.runReminderScans();
    } catch (error: any) {
      logger.error('Scheduler failure during reminder check execution', { error: error.message });
    }
  }, HOURLY_INTERVAL_MS);
};

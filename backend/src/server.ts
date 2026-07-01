import app from './app.js';
import { config } from './config/config.js';
import { logger } from './core/logger.js';
import { initReminderScheduler } from './jobs/reminderScheduler.js';

const server = app.listen(config.PORT, () => {
  logger.info(`Afya Flow server successfully started on port ${config.PORT} in ${config.NODE_ENV} mode`);
  initReminderScheduler();
});

const handleTermination = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });

  // Force exit after 10 seconds if not shut down gracefully
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleTermination('SIGTERM'));
process.on('SIGINT', () => handleTermination('SIGINT'));

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception details:', {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection details:', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

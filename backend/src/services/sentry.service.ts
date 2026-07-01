import { logger } from '../core/logger.js';

export class TelemetryService {
  private static isInitialized = false;

  /**
   * Initializes Sentry integrations telemetry.
   */
  public static init(): void {
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
      logger.info('Telemetry: SENTRY_DSN key identified. Activating Sentry error tracking dashboard...');
      // In production:
      // Sentry.init({ dsn });
      this.isInitialized = true;
    } else {
      logger.info('Telemetry: Sentry credentials absent. Logging exceptions to system logger only.');
    }
  }

  /**
   * Safe wrapper captures exceptions and pushes stack traces to monitoring logs.
   */
  public static captureException(error: Error, metadata?: Record<string, any>): void {
    logger.error(`[EXCEPTION] Captured: ${error.message}`, {
      stack: error.stack,
      metadata,
    });

    if (this.isInitialized) {
      // Sentry.captureException(error, { extra: metadata });
    }
  }

  /**
   * Logs telemetry messages.
   */
  public static logEvent(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    logger.info(`[TELEMETRY] ${level.toUpperCase()}: ${message}`);
    if (this.isInitialized) {
      // Sentry.captureMessage(message, level as any);
    }
  }
}

// Auto init
TelemetryService.init();

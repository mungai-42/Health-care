import { prisma } from '../config/db.js';
import { logger } from '../core/logger.js';

export class NotificationService {
  /**
   * Dispatches push alert using Firebase Cloud Messaging (FCM) simulator.
   */
  public static async sendPush(userId: string, title: string, body: string): Promise<void> {
    try {
      logger.info(`[FCM PUSH] Sending to User: ${userId} | Title: ${title} | Body: ${body}`);
      
      // Store record in DB for in-app history sync
      await prisma.notificationRecord.create({
        data: {
          userId,
          title,
          body,
          type: 'PUSH',
        },
      });
    } catch (error: any) {
      logger.error('Failed to send push notification', { error: error.message });
    }
  }

  /**
   * Dispatches clinical email alert using mock SMTP mail service.
   */
  public static async sendEmail(userId: string, title: string, body: string): Promise<void> {
    try {
      // Find recipient address
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const email = user?.email || 'unknown@afyaflow.com';

      logger.info(`[SMTP EMAIL] Dispatched to: ${email} | Subject: ${title} | Content: ${body}`);

      await prisma.notificationRecord.create({
        data: {
          userId,
          title,
          body,
          type: 'EMAIL',
        },
      });
    } catch (error: any) {
      logger.error('Failed to send email alert', { error: error.message });
    }
  }

  /**
   * Logs a persistent in-app alarm notification.
   */
  public static async sendInApp(userId: string, title: string, body: string): Promise<void> {
    try {
      logger.info(`[IN-APP ALERT] User: ${userId} | Message: ${body}`);
      
      await prisma.notificationRecord.create({
        data: {
          userId,
          title,
          body,
          type: 'IN_APP',
        },
      });
    } catch (error: any) {
      logger.error('Failed to send in-app notification', { error: error.message });
    }
  }
}

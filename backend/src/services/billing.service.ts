import { prisma } from '../config/db.js';
import { logger } from '../core/logger.js';

export enum PaymentMethod {
  MPESA = 'MPESA',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  GRACE_PERIOD = 'GRACE_PERIOD',
  EXPIRED = 'EXPIRED',
}

export class BillingService {
  /**
   * Simulates an M-Pesa STK Push prompt trigger.
   */
  public static async initiateMpesaPayment(invoiceId: string, phone: string): Promise<any> {
    logger.info(`[M-PESA GATEWAY] Initiating STK Push for Invoice: ${invoiceId} to Phone: ${phone}`);

    // Verify invoice
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new Error('Invoice not found');

    // Simulate async callback success
    const transactionId = `MPESA-TXN-${Date.now()}`;
    
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        method: 'MPESA',
        paidAt: new Date(),
      },
    });

    logger.info(`[M-PESA GATEWAY] STK Callback SUCCESS for Invoice: ${invoiceId} | Transaction: ${transactionId}`);
    return { success: true, transactionId, message: 'STK Push processed successfully' };
  }

  /**
   * Simulates Card Payments (Visa/Mastercard).
   */
  public static async processCardPayment(invoiceId: string, cardName: string, cardNumber: string): Promise<any> {
    logger.info(`[CARD GATEWAY] Authorizing card transaction on card **** **** **** ${cardNumber.substring(cardNumber.length - 4)}`);

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new Error('Invoice not found');

    const transactionId = `CARD-TXN-${Date.now()}`;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        method: 'CARD',
        paidAt: new Date(),
      },
    });

    return { success: true, transactionId, message: 'Card charge successful' };
  }

  /**
   * Simulates bank wire receipts.
   */
  public static async processBankTransfer(invoiceId: string, refNumber: string): Promise<any> {
    logger.info(`[BANK GATEWAY] Validating wire transfer reference: ${refNumber}`);

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new Error('Invoice not found');

    const transactionId = `BANK-TXN-${refNumber}`;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        method: 'BANK_TRANSFER',
        paidAt: new Date(),
      },
    });

    return { success: true, transactionId, message: 'Bank transfer cleared' };
  }

  /**
   * Check organization subscriptions for grace period limits.
   */
  public static async checkSubscriptionGracePeriod(subscriptionId: string): Promise<any> {
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub) throw new Error('Subscription not found');

    const now = new Date();
    if (now.getTime() > sub.endDate.getTime()) {
      // If grace period has also expired, lock subscription
      if (sub.gracePeriodEndsAt && now.getTime() > sub.gracePeriodEndsAt.getTime()) {
        return await prisma.subscription.update({
          where: { id: subscriptionId },
          data: { status: 'EXPIRED' },
        });
      }

      // Enter grace period (7 days)
      if (sub.status !== 'GRACE_PERIOD') {
        const graceEnd = new Date();
        graceEnd.setDate(graceEnd.getDate() + 7);

        return await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'GRACE_PERIOD',
            gracePeriodEndsAt: graceEnd,
          },
        });
      }
    }

    return sub;
  }
}

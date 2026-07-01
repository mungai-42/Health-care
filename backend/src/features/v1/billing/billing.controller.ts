import { Request, Response } from 'express';
import { prisma } from '../../../config/db.js';
import { BillingService } from '../../../services/billing.service.js';

export const listInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    let invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Seed mock invoices if database is empty
    if (invoices.length === 0) {
      await prisma.invoice.createMany({
        data: [
          {
            recipientName: 'Sarah Jenkins (Patient)',
            amount: 25.0,
            status: 'UNPAID',
            method: 'MPESA',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
          {
            recipientName: 'John Doe (Patient)',
            amount: 50.0,
            status: 'PAID',
            method: 'CARD',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            paidAt: new Date(),
          },
          {
            recipientName: 'Michael Miller (Patient)',
            amount: 15.0,
            status: 'OVERDUE',
            method: 'MPESA',
            dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        ],
      });

      invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    res.status(200).json({ success: true, invoices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    let sub = await prisma.subscription.findFirst();

    // Seed organization subscription if none exists
    if (!sub) {
      sub = await prisma.subscription.create({
        data: {
          orgName: 'Afya Care Hospital',
          planName: 'Enterprise Premium Plan',
          amount: 249.0,
          status: 'ACTIVE',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    // Proactively check grace periods
    sub = await BillingService.checkSubscriptionGracePeriod(sub.id);

    res.status(200).json({ success: true, subscription: sub });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const payInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId, paymentMethod, phone, cardName, cardNumber, refNumber } = req.body;

    if (!invoiceId || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Invoice ID and payment method are required' });
      return;
    }

    let result;
    if (paymentMethod === 'MPESA') {
      if (!phone) {
        res.status(400).json({ success: false, message: 'Phone number is required for M-Pesa STK Push' });
        return;
      }
      result = await BillingService.initiateMpesaPayment(invoiceId, phone);
    } else if (paymentMethod === 'CARD') {
      if (!cardName || !cardNumber) {
        res.status(400).json({ success: false, message: 'Card credentials are required for Card authorization' });
        return;
      }
      result = await BillingService.processCardPayment(invoiceId, cardName, cardNumber);
    } else if (paymentMethod === 'BANK_TRANSFER') {
      if (!refNumber) {
        res.status(400).json({ success: false, message: 'Wire reference number is required' });
        return;
      }
      result = await BillingService.processBankTransfer(invoiceId, refNumber);
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment method' });
      return;
    }

    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

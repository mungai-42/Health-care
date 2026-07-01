import { Request, Response } from 'express';
import { prisma } from '../../../config/db.js';
import { AiService } from '../../../services/ai.service.js';

export const handlePatientChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, conversationId } = req.body;
    const userId = (req as any).user.id;

    if (!prompt) {
      res.status(400).json({ success: false, message: 'Prompt is required' });
      return;
    }

    // Determine/create active conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.aiConversation.findFirst({
        where: { id: conversationId, userId },
      });
    }

    if (!conversation) {
      // Create new chat room title
      const title = prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt;
      conversation = await prisma.aiConversation.create({
        data: { userId, title },
      });
    }

    // Query safe educational response
    const reply = await AiService.queryEducationalAssistant(prompt);

    // Save logs to DB
    await prisma.$transaction([
      prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: prompt,
        },
      }),
      prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: `${reply.content}\n\nDisclaimer: ${reply.disclaimer}`,
        },
      }),
      prisma.aiUsage.create({
        data: {
          userId,
          queryType: 'PATIENT_CHAT',
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      conversationId: conversation.id,
      reply: reply.content,
      disclaimer: reply.disclaimer,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleMealPlanDraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientCondition } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Doctor checks guard
    if (userRole !== 'ORG_DOCTOR' && userRole !== 'ORG_ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden. Doctors only.' });
      return;
    }

    if (!patientCondition) {
      res.status(400).json({ success: false, message: 'Patient clinical condition/notes are required' });
      return;
    }

    const draft = await AiService.generateMealPlanDraft(patientCondition);

    // Audit trace log
    await prisma.aiUsage.create({
      data: {
        userId,
        queryType: 'DOCTOR_MEAL_PLAN_DRAFT',
      },
    });

    res.status(200).json({
      success: true,
      draft,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const conversations = await prisma.aiConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

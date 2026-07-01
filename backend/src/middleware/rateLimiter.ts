import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';

interface RateLimitInfo {
  timestamps: number[];
}

const userRequestCache = new Map<string, RateLimitInfo>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // Max 5 requests per minute for AI queries

export const aiRateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // If user is not authenticated, fallback to IP (though AI endpoints should be auth-only)
  const userId = (req as any).user?.id || req.ip || 'anonymous';
  const now = Date.now();

  let limitInfo = userRequestCache.get(userId);
  if (!limitInfo) {
    limitInfo = { timestamps: [] };
    userRequestCache.set(userId, limitInfo);
  }

  // Filter timestamps within the sliding window
  limitInfo.timestamps = limitInfo.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (limitInfo.timestamps.length >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      message: 'Too many AI requests. Please wait a minute before querying again.',
    });
    return;
  }

  // Allow the request, track the timestamp
  limitInfo.timestamps.push(now);
  next();
};

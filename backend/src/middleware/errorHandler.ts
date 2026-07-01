import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors.js';
import { logger } from '../core/logger.js';
import { config } from '../config/config.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isDevelopment = config.NODE_ENV === 'development';

  if (err instanceof AppError) {
    logger.warn(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.errorCode,
        ...(isDevelopment && { stack: err.stack }),
      },
    });
    return;
  }

  // Programming or unknown error
  logger.error(`Unhandled System Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      message: isDevelopment ? err.message : 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
      ...(isDevelopment && { stack: err.stack }),
    },
  });
};

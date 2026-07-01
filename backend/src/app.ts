import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './core/errors.js';
import { logger } from './core/logger.js';

import authRoutes from './features/v1/auth/auth.routes.js';
import adminRoutes from './features/v1/admin/admin.routes.js';
import aiRoutes from './features/v1/ai/ai.routes.js';
import billingRoutes from './features/v1/billing/billing.routes.js';
import patientRoutes from './features/v1/patient/patient.routes.js';
import clinicalRoutes from './features/v1/clinical/clinical.routes.js';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN === '*' ? '*' : config.CORS_ORIGIN.split(','),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
  });
});

// Route mountings
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/clinical', clinicalRoutes);

// Base API route for version 1 structure
app.get('/api/v1', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Afya Flow API v1',
    docs: '/api/v1/docs',
  });
});

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(new NotFoundError('The requested route could not be found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;

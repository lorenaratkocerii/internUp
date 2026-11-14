import cors from 'cors';
import express from 'express';
import { createErrorHandler } from '../../adapters/inbound/http/middleware/errorHandler.js';
import { notFoundHandler } from '../../adapters/inbound/http/middleware/notFoundHandler.js';
import { createApiRoutes } from '../../adapters/inbound/http/routes/index.js';

export function createApp({ controllers, corsOrigins, logger = console }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', createApiRoutes(controllers));

  app.use(notFoundHandler);
  app.use(createErrorHandler({ logger }));

  return app;
}

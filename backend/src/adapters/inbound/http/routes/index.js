import { Router } from 'express';
import { sendSuccess } from '../apiResponse.js';
import { createHomeRoutes } from './homeRoutes.js';

export function createApiRoutes({ homeController }) {
  const router = Router();

  router.get('/health', (_req, res) => sendSuccess(res, { status: 'ok', uptime: Math.round(process.uptime()) }));
  router.use('/home', createHomeRoutes(homeController));

  return router;
}

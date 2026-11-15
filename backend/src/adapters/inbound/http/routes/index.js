import { Router } from 'express';
import { sendSuccess } from '../apiResponse.js';
import { createAdminRoutes } from './adminRoutes.js';
import { createHomeRoutes } from './homeRoutes.js';

export function createApiRoutes({ homeController, adminController, requireAdmin, loginRateLimiter }) {
  const router = Router();

  router.get('/health', (_req, res) => sendSuccess(res, { status: 'ok', uptime: Math.round(process.uptime()) }));
  router.use('/home', createHomeRoutes(homeController));
  router.use('/admin', createAdminRoutes({ adminController, requireAdmin, loginRateLimiter }));

  return router;
}

import { Router } from 'express';

export function createAdminRoutes({ adminController, requireAdmin, loginRateLimiter }) {
  const router = Router();

  router.post('/login', loginRateLimiter, adminController.login);

  router.use(requireAdmin);
  router.get('/me', adminController.getMe);
  router.get('/home', adminController.getHomeContent);
  router.put('/home/partner-companies', adminController.setPartnerCompanies);
  router.patch('/home/companies/:companyId', adminController.updateCompany);
  router.patch('/home/internships/:internshipId', adminController.updateInternship);
  router.patch('/home/stories/:storyId', adminController.updateStory);

  return router;
}

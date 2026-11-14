import { Router } from 'express';

export function createHomeRoutes(homeController) {
  const router = Router();

  router.get('/', homeController.getOverview);
  router.get('/stats', homeController.getStats);
  router.get('/partner-companies', homeController.getPartnerCompanies);
  router.get('/search-options', homeController.getSearchOptions);
  router.get('/internships', homeController.searchInternships);
  router.get('/universities', homeController.getUniversities);
  router.get('/stories', homeController.getStories);

  return router;
}

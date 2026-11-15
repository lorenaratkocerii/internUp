const segment = encodeURIComponent;

export function createHttpAdminGateway(http) {
  return {
    login: ({ email, password }) => http.post('/admin/login', { email, password }),
    getHomeContent: () => http.get('/admin/home'),
    setPartnerCompanies: (companyIds) => http.put('/admin/home/partner-companies', { companyIds }),
    updateCompany: (companyId, changes) => http.patch(`/admin/home/companies/${segment(companyId)}`, changes),
    updateInternship: (internshipId, changes) =>
      http.patch(`/admin/home/internships/${segment(internshipId)}`, changes),
    updateStory: (storyId, changes) => http.patch(`/admin/home/stories/${segment(storyId)}`, changes),
  };
}

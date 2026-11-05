export function createMockApplicationRepository() {
  const applications = [];

  return {
    save: async (application) => {
      applications.push(application);
    },
    exists: async (internshipId, email) =>
      applications.some((item) => item.internshipId === internshipId && item.email === email),
  };
}

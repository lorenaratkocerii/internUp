export function createMockCompanyRegistrationRepository() {
  const registrations = [];

  return {
    save: async (registration) => {
      registrations.push(registration);
    },
    exists: async (email) => registrations.some((item) => item.email === email),
  };
}

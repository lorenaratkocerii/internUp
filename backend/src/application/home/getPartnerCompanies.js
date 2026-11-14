import { PARTNERS_ON_HOME } from '../../domain/company/Company.js';

export function createGetPartnerCompanies({ companies }) {
  return async function getPartnerCompanies({ limit = PARTNERS_ON_HOME } = {}) {
    return companies.findPartners(limit);
  };
}

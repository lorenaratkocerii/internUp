import { DomainError } from '../shared/DomainError.js';

export const WorkMode = Object.freeze({
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-site',
});

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export function createInternship({
  id,
  title,
  companyId,
  company,
  location,
  workMode,
  durationMonths,
  schedule = '',
  paid = false,
  stipend = null,
  description = '',
  skills = [],
  opensAt,
  closesAt,
  seats,
  featured = false,
}) {
  if (!id || !title || !companyId || !company || !location) {
    throw new DomainError('Një praktikë duhet të ketë id, titull, kompani dhe lokacion.');
  }
  if (!Object.values(WorkMode).includes(workMode)) {
    throw new DomainError(`Mënyrë pune e panjohur: ${workMode}`);
  }
  if (!Number.isInteger(durationMonths) || durationMonths <= 0) {
    throw new DomainError('Kohëzgjatja e praktikës duhet të jetë numër i plotë pozitiv.');
  }
  if (!ISO_DAY.test(opensAt ?? '') || !ISO_DAY.test(closesAt ?? '') || closesAt < opensAt) {
    throw new DomainError('Data e mbylljes së aplikimit nuk mund të jetë para datës së hapjes.');
  }
  if (!Number.isInteger(seats) || seats < 0) {
    throw new DomainError('Numri i vendeve të lira duhet të jetë numër i plotë jo negativ.');
  }

  return Object.freeze({
    id,
    title,
    companyId,
    company,
    location,
    workMode,
    durationMonths,
    schedule,
    paid,
    stipend: paid && Number(stipend) > 0 ? Number(stipend) : null,
    description,
    skills: Object.freeze([...skills]),
    opensAt,
    closesAt,
    seats,
    featured,
  });
}

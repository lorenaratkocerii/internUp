export const WorkMode = Object.freeze({
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-site',
});

export function createInternship({
  id,
  title,
  companyId,
  company,
  location,
  workMode,
  durationMonths,
  schedule,
  paid = false,
  description,
  responsibilities = [],
  skills = [],
  opensAt,
  closesAt,
  seats,
  featured = false,
}) {
  if (!id || !title || !companyId || !company || !location) {
    throw new Error('Një praktikë duhet të ketë id, titull, kompani dhe lokacion.');
  }
  if (!Object.values(WorkMode).includes(workMode)) {
    throw new Error(`Mënyrë pune e panjohur: ${workMode}`);
  }
  if (!Number.isInteger(durationMonths) || durationMonths <= 0) {
    throw new Error('Kohëzgjatja e praktikës duhet të jetë numër i plotë pozitiv.');
  }
  if (!opensAt || !closesAt || closesAt < opensAt) {
    throw new Error('Data e mbylljes së aplikimit nuk mund të jetë para datës së hapjes.');
  }
  if (!Number.isInteger(seats) || seats < 0) {
    throw new Error('Numri i vendeve të lira duhet të jetë numër i plotë jo negativ.');
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
    description,
    responsibilities: Object.freeze([...responsibilities]),
    skills: Object.freeze([...skills]),
    opensAt,
    closesAt,
    seats,
    featured,
  });
}

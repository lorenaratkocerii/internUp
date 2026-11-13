const MONTHS = ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'];

export function formatDay(value) {
  if (!value) return '';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export const WORK_MODE_LABELS = { Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' };

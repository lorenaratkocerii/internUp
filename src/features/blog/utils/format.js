const MONTHS = ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'];

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso).slice(0, 10);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export const readingTimeLabel = (minutes) => `${minutes} min lexim`;
export const durationLabel = (months) => (months === 1 ? '1 muaj' : `${months} muaj`);

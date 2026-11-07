const dayFormatter = new Intl.DateTimeFormat('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatDay(value) {
  if (!value) return '';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? value : dayFormatter.format(date);
}

export const WORK_MODE_LABELS = { Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' };

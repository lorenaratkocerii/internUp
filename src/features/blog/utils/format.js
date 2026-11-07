const dateFormatter = new Intl.DateTimeFormat('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' });

export function formatDate(iso) {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return String(iso).slice(0, 10);
  }
}

export const readingTimeLabel = (minutes) => `${minutes} min lexim`;
export const durationLabel = (months) => (months === 1 ? '1 muaj' : `${months} muaj`);

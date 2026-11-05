export const ApplicationStatus = Object.freeze({
  OPEN: 'Open',
  CLOSING_SOON: 'Closing Soon',
  CLOSED: 'Closed',
});

export const CLOSING_SOON_DAYS = 7;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDay(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getApplicationStatus({ opensAt, closesAt, seats }, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const opens = parseDay(opensAt);
  const closes = parseDay(closesAt);

  if (today < opens || today > closes || seats === 0) {
    return ApplicationStatus.CLOSED;
  }
  const daysLeft = Math.round((closes - today) / MS_PER_DAY);
  return daysLeft <= CLOSING_SOON_DAYS ? ApplicationStatus.CLOSING_SOON : ApplicationStatus.OPEN;
}

export function acceptsApplications(internship, now = new Date()) {
  return getApplicationStatus(internship, now) !== ApplicationStatus.CLOSED;
}

export function withApplicationStatus(internship, now = new Date()) {
  const status = getApplicationStatus(internship, now);
  return Object.freeze({ ...internship, status, canApply: status !== ApplicationStatus.CLOSED });
}

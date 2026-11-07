import { WorkMode } from './Internship';

export const InternshipDraftLimits = Object.freeze({
  TITLE_MIN: 5,
  TITLE_MAX: 90,
  DESCRIPTION_MIN: 40,
  DURATION_MIN: 1,
  DURATION_MAX: 24,
  SEATS_MIN: 1,
  SEATS_MAX: 50,
});

export const WORK_MODE_OPTIONS = Object.freeze([
  { value: WorkMode.REMOTE, label: 'Remote · Në distancë' },
  { value: WorkMode.HYBRID, label: 'Hybrid · Hibrid' },
  { value: WorkMode.ON_SITE, label: 'On-site · Në zyrë' },
]);

export function toIsoDay(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

const lines = (text) =>
  String(text ?? '')
    .split('\n')
    .map((item) => item.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

const commaList = (text) => [
  ...new Set(
    String(text ?? '')
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];

export function emptyInternshipDraft({ location = '', now = new Date() } = {}) {
  const closes = new Date(now);
  closes.setDate(closes.getDate() + 30);
  return {
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    location,
    workMode: WorkMode.HYBRID,
    durationMonths: '3',
    schedule: '',
    seats: '1',
    paid: false,
    stipend: '',
    opensAt: toIsoDay(now),
    closesAt: toIsoDay(closes),
  };
}

export function draftFromInternship(internship) {
  return {
    title: internship.title,
    description: internship.description ?? '',
    responsibilities: (internship.responsibilities ?? []).join('\n'),
    requirements: (internship.requirements ?? []).join('\n'),
    skills: (internship.skills ?? []).join(', '),
    location: internship.location,
    workMode: internship.workMode,
    durationMonths: String(internship.durationMonths),
    schedule: internship.schedule ?? '',
    seats: String(internship.seats),
    paid: Boolean(internship.paid),
    stipend: internship.stipend ? String(internship.stipend) : '',
    opensAt: internship.opensAt,
    closesAt: internship.closesAt,
  };
}

export function validateInternshipDraft(draft) {
  const errors = {};
  const text = (name) => String(draft[name] ?? '').trim();
  const required = [
    ['title', 'Titulli i pozitës'],
    ['description', 'Përshkrimi'],
    ['requirements', 'Kërkesat'],
    ['skills', 'Aftësitë e nevojshme'],
    ['location', 'Lokacioni'],
    ['workMode', 'Work mode'],
    ['durationMonths', 'Kohëzgjatja'],
    ['seats', 'Vende të lira'],
    ['opensAt', 'Data e hapjes'],
    ['closesAt', 'Afati i aplikimit'],
  ];
  for (const [name, label] of required) {
    if (!text(name)) errors[name] = `Plotëso fushën "${label}".`;
  }

  const { TITLE_MIN, TITLE_MAX, DESCRIPTION_MIN, DURATION_MIN, DURATION_MAX, SEATS_MIN, SEATS_MAX } = InternshipDraftLimits;
  if (!errors.title && (text('title').length < TITLE_MIN || text('title').length > TITLE_MAX)) {
    errors.title = `Titulli duhet të ketë ${TITLE_MIN}–${TITLE_MAX} karaktere.`;
  }
  if (!errors.description && text('description').length < DESCRIPTION_MIN) {
    errors.description = `Përshkruaj pozitën me të paktën ${DESCRIPTION_MIN} karaktere.`;
  }
  if (draft.workMode && !Object.values(WorkMode).includes(draft.workMode)) errors.workMode = 'Zgjidh Remote, Hybrid ose On-site.';

  const duration = Number(draft.durationMonths);
  if (!errors.durationMonths && (!Number.isInteger(duration) || duration < DURATION_MIN || duration > DURATION_MAX)) {
    errors.durationMonths = `Kohëzgjatja duhet të jetë ${DURATION_MIN}–${DURATION_MAX} muaj.`;
  }
  const seats = Number(draft.seats);
  if (!errors.seats && (!Number.isInteger(seats) || seats < SEATS_MIN || seats > SEATS_MAX)) {
    errors.seats = `Numri i vendeve duhet të jetë ${SEATS_MIN}–${SEATS_MAX}.`;
  }
  if (draft.paid && text('stipend')) {
    const stipend = Number(text('stipend'));
    if (!Number.isFinite(stipend) || stipend <= 0) errors.stipend = 'Shuma duhet të jetë numër pozitiv (p.sh. 300).';
  }
  if (!errors.opensAt && !errors.closesAt && text('closesAt') < text('opensAt')) {
    errors.closesAt = 'Afati i aplikimit nuk mund të jetë para datës së hapjes.';
  }
  return errors;
}

export function internshipFieldsFromDraft(draft) {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    responsibilities: lines(draft.responsibilities),
    requirements: lines(draft.requirements),
    skills: commaList(draft.skills),
    location: draft.location.trim(),
    workMode: draft.workMode,
    durationMonths: Number(draft.durationMonths),
    schedule: draft.schedule.trim() || 'Orari caktohet me mentorin',
    seats: Number(draft.seats),
    paid: Boolean(draft.paid),
    stipend: draft.paid && String(draft.stipend).trim() ? Number(draft.stipend) : null,
    opensAt: draft.opensAt,
    closesAt: draft.closesAt,
  };
}

import { isKnownCategory, StoryWorkMode, WORK_MODE_LABELS } from './storyTaxonomy';

const WORDS_PER_MINUTE = 180;
export const ANONYMOUS_AUTHOR = 'Student anonim';

export const StoryLimits = Object.freeze({
  TITLE_MIN: 10,
  TITLE_MAX: 110,
  EXCERPT_MIN: 30,
  EXCERPT_MAX: 220,
  CONTENT_MIN: 300,
  DURATION_MIN: 1,
  DURATION_MAX: 24,
  MAX_LIST_ITEMS: 8,
});

export class StoryError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = 'StoryError';
    this.fieldErrors = fieldErrors;
  }
}

export function estimateReadingMinutes(paragraphs) {
  const words = paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function splitParagraphs(text) {
  return String(text ?? '')
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export function splitList(text) {
  return String(text ?? '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, StoryLimits.MAX_LIST_ITEMS);
}

export function workModeLabel(mode) {
  return WORK_MODE_LABELS[mode] ?? mode;
}

export function createStory({
  id,
  title,
  excerpt,
  content = [],
  category,
  field,
  coverImage = '',
  coverAlt = '',
  author,
  anonymous = false,
  verified = false,
  verifiedAt = null,
  companyId = null,
  companyName,
  position,
  durationMonths,
  workMode,
  location = '',
  challenges = [],
  skills = [],
  publishedAt,
  featured = false,
}) {
  if (!id || !title || !companyName || !position) {
    throw new StoryError('Një histori duhet të ketë id, titull, kompani dhe pozitë.');
  }
  if (!isKnownCategory(category)) throw new StoryError(`Kategori e panjohur: ${category}`);
  if (!Object.values(StoryWorkMode).includes(workMode)) throw new StoryError(`Mënyrë pune e panjohur: ${workMode}`);
  if (Number.isNaN(Date.parse(publishedAt))) throw new StoryError('Data e publikimit nuk është e vlefshme.');

  const paragraphs = Object.freeze([...content]);
  const authorName = anonymous ? ANONYMOUS_AUTHOR : author?.name ?? ANONYMOUS_AUTHOR;

  return Object.freeze({
    id,
    title,
    excerpt,
    content: paragraphs,
    category,
    field,
    coverImage,
    coverAlt,
    author: Object.freeze({
      name: authorName,
      initials: anonymous ? '?' : initialsOf(authorName),
      university: author?.university ?? '',
      studyProgram: author?.studyProgram ?? '',
      email: author?.email ?? '',
    }),
    anonymous,
    verified,
    verifiedAt: verified ? verifiedAt : null,
    companyId,
    companyName,
    position,
    durationMonths: Number(durationMonths),
    workMode,
    location,
    challenges: Object.freeze([...challenges]),
    skills: Object.freeze([...skills]),
    publishedAt,
    featured,
    readingMinutes: estimateReadingMinutes(paragraphs),
  });
}

export function validateStoryDraft(draft) {
  const errors = {};
  const text = (name) => String(draft[name] ?? '').trim();
  const required = [
    ['title', 'Titulli'],
    ['excerpt', 'Përmbledhja'],
    ['content', 'Përvoja jote'],
    ['category', 'Kategoria'],
    ['field', 'Fusha'],
    ['companyId', 'Kompania'],
    ['position', 'Pozita'],
    ['durationMonths', 'Kohëzgjatja'],
    ['workMode', 'Mënyra e punës'],
    ['university', 'Universiteti'],
    ['challenges', 'Sfidat'],
    ['skills', 'Aftësitë e fituara'],
  ];
  if (!draft.anonymous) required.push(['authorName', 'Emri yt']);

  for (const [name, label] of required) {
    if (!text(name)) errors[name] = `Plotëso fushën "${label}".`;
  }

  if (!errors.title && (text('title').length < StoryLimits.TITLE_MIN || text('title').length > StoryLimits.TITLE_MAX)) {
    errors.title = `Titulli duhet të ketë ${StoryLimits.TITLE_MIN}–${StoryLimits.TITLE_MAX} karaktere.`;
  }
  if (!errors.excerpt && (text('excerpt').length < StoryLimits.EXCERPT_MIN || text('excerpt').length > StoryLimits.EXCERPT_MAX)) {
    errors.excerpt = `Përmbledhja duhet të ketë ${StoryLimits.EXCERPT_MIN}–${StoryLimits.EXCERPT_MAX} karaktere.`;
  }
  if (!errors.content && text('content').length < StoryLimits.CONTENT_MIN) {
    errors.content = `Shkruaj të paktën ${StoryLimits.CONTENT_MIN} karaktere që historia të jetë e dobishme.`;
  }
  const duration = Number(draft.durationMonths);
  if (!errors.durationMonths && (!Number.isInteger(duration) || duration < StoryLimits.DURATION_MIN || duration > StoryLimits.DURATION_MAX)) {
    errors.durationMonths = `Kohëzgjatja duhet të jetë ${StoryLimits.DURATION_MIN}–${StoryLimits.DURATION_MAX} muaj.`;
  }
  if (draft.category && !isKnownCategory(draft.category)) errors.category = 'Zgjidh një kategori nga lista.';
  if (!draft.acceptsGuidelines) errors.acceptsGuidelines = 'Konfirmo që historia është e vërtetë dhe respekton rregullat.';

  return errors;
}

export function withVerification(story, verified, now = new Date()) {
  return createStory({
    ...story,
    author: { ...story.author, name: story.anonymous ? '' : story.author.name },
    verified,
    verifiedAt: verified ? now.toISOString() : null,
  });
}

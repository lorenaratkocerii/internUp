import { DomainError } from '../shared/DomainError.js';
import { categoryLabel, isKnownCategory } from './storyTaxonomy.js';

export const ANONYMOUS_AUTHOR = 'Student anonim';
export const STORIES_ON_HOME = 3;

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function createStory({
  id,
  title,
  excerpt = '',
  category,
  field = '',
  author,
  anonymous = false,
  verified = false,
  companyId = null,
  companyName = '',
  position,
  publishedAt,
  featured = false,
}) {
  if (!id || !title || !position) {
    throw new DomainError('Një histori duhet të ketë id, titull dhe pozitë.');
  }
  if (!isKnownCategory(category)) throw new DomainError(`Kategori e panjohur: ${category}`);
  if (Number.isNaN(Date.parse(publishedAt))) throw new DomainError('Data e publikimit nuk është e vlefshme.');

  const authorName = anonymous ? ANONYMOUS_AUTHOR : author?.name || ANONYMOUS_AUTHOR;

  return Object.freeze({
    id,
    title,
    excerpt,
    category,
    categoryLabel: categoryLabel(category),
    field,
    author: Object.freeze({
      name: authorName,
      initials: anonymous ? '?' : initialsOf(authorName),
      university: author?.university ?? '',
    }),
    anonymous,
    verified,
    companyId,
    companyName,
    position,
    publishedAt,
    featured,
  });
}

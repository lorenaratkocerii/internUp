import { createStory } from '../../../../domain/story/Story.js';

export const storyInclude = Object.freeze({ company: { select: { slug: true, name: true } } });

export function toStory(record) {
  return createStory({
    id: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    category: record.category,
    field: record.field,
    author: { name: record.authorName ?? '', university: record.authorUniversity ?? '' },
    anonymous: record.anonymous,
    verified: record.verified,
    companyId: record.company?.slug ?? null,
    companyName: record.company?.name ?? '',
    position: record.position,
    publishedAt: record.publishedAt.toISOString(),
    featured: record.featured,
  });
}

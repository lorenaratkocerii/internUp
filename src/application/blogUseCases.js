import { createStory, splitList, splitParagraphs, StoryError, validateStoryDraft } from '../domain/blog/Story';
import { browseStories, DATE_ORDER_OPTIONS, DateOrder, sortByNewest } from '../domain/blog/storyFilters';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asStoryRepository } from './ports/StoryRepository';

export { DATE_ORDER_OPTIONS, DateOrder, StoryError };

const FEATURED_LIMIT = 3;
const RELATED_LIMIT = 3;
export const GUEST_VIEWER = Object.freeze({ id: 'vizitor', role: null });

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

export function createBlogUseCases({ storyRepository, companyRepository, now = () => new Date() }) {
  const stories = asStoryRepository(storyRepository);
  const companies = asCompanyRepository(companyRepository);

  return Object.freeze({
    listStories: async () => sortByNewest(await stories.findAll()),

    getFeaturedStories: async () =>
      sortByNewest((await stories.findAll()).filter((story) => story.featured)).slice(0, FEATURED_LIMIT),

    getStory: async (storyId) => {
      const story = await stories.findById(storyId);
      if (!story) return null;
      const related = (await stories.findAll())
        .filter((item) => item.id !== story.id)
        .map((item) => ({
          item,
          score: (item.category === story.category ? 2 : 0) + (item.field === story.field ? 1 : 0),
        }))
        .sort((a, b) => b.score - a.score || Date.parse(b.item.publishedAt) - Date.parse(a.item.publishedAt))
        .slice(0, RELATED_LIMIT)
        .map(({ item }) => item);
      return { story, related };
    },

    publishStory: async (draft, viewer) => {
      if (viewer?.role !== 'student') {
        throw new StoryError('Vetëm studentët e kyçur mund të publikojnë histori.');
      }
      const fieldErrors = validateStoryDraft(draft);
      if (Object.keys(fieldErrors).length > 0) {
        throw new StoryError('Kontrollo fushat e shënuara.', fieldErrors);
      }
      const company = await companies.findById(draft.companyId);
      if (!company) {
        throw new StoryError('Kontrollo fushat e shënuara.', {
          companyId: 'Zgjidh një kompani nga lista e kompanive në InternUp.',
        });
      }

      const title = draft.title.trim();
      const story = createStory({
        id: `${slugify(title)}-${now().getTime().toString(36)}`,
        title,
        excerpt: draft.excerpt.trim(),
        content: splitParagraphs(draft.content),
        category: draft.category,
        field: draft.field,
        coverImage: draft.coverImage || '',
        coverAlt: draft.coverImage ? `Fotografi nga praktika te ${company.name}` : '',
        author: {
          name: draft.anonymous ? '' : draft.authorName.trim(),
          university: draft.university.trim(),
          studyProgram: draft.studyProgram?.trim() ?? '',
          email: viewer.email ?? '',
        },
        anonymous: Boolean(draft.anonymous),
        verified: false,
        companyId: company.id,
        companyName: company.name,
        position: draft.position.trim(),
        durationMonths: Number(draft.durationMonths),
        workMode: draft.workMode,
        location: draft.location?.trim() || company.location,
        challenges: splitList(draft.challenges),
        skills: splitList(draft.skills),
        publishedAt: now().toISOString(),
      });
      await stories.save(story);
      return story;
    },

    listCompanyOptions: async () =>
      (await companies.findAll())
        .map((company) => ({ id: company.id, name: company.name, location: company.location }))
        .sort((a, b) => a.name.localeCompare(b.name, 'sq')),

    browseStories,

    validateStoryDraft,
  });
}

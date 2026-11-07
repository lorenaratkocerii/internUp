import { createStory, StoryError } from '../../../domain/blog/Story';
import { createLocalJsonStore } from './localJsonStore';
import { storyRecords } from './storyData';

function toStory(record) {
  try {
    return createStory(record);
  } catch {
    return null;
  }
}

export function createMockStoryRepository(records = storyRecords) {
  const seeded = records.map(createStory);
  const published = createLocalJsonStore('internup:blog-stories', []);
  const overrides = createLocalJsonStore('internup:blog-story-overrides', {});

  const getAll = () => {
    const changed = overrides.read();
    const base = seeded.map((story) => (changed[story.id] ? toStory(changed[story.id]) ?? story : story));
    return [...published.read().map(toStory).filter(Boolean), ...base];
  };

  const persist = (story) => {
    if (seeded.some((item) => item.id === story.id)) {
      overrides.update((changed) => ({ ...changed, [story.id]: story }));
      return;
    }
    published.update((list) =>
      list.some((item) => item.id === story.id)
        ? list.map((item) => (item.id === story.id ? story : item))
        : [story, ...list],
    );
  };

  return {
    findAll: async () => getAll(),
    findById: async (id) => getAll().find((story) => story.id === id) ?? null,
    save: async (story) => {
      try {
        persist(story);
      } catch {
        throw new StoryError('Historia nuk u ruajt. Fotografia mund të jetë shumë e madhe — provo një më të vogël.');
      }
    },
  };
}

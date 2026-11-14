import { STORIES_ON_HOME } from '../../domain/story/Story.js';

export function createGetLatestStories({ stories }) {
  return async function getLatestStories({ limit = STORIES_ON_HOME } = {}) {
    return stories.findLatest(limit);
  };
}

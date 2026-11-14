import { assertPort } from './assertPort.js';

export const asStoryRepository = (adapter) =>
  assertPort(adapter, 'StoryRepository', ['findLatest', 'count']);

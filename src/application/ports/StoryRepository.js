import { assertPort } from './assertPort';

export const asStoryRepository = (adapter) =>
  assertPort(adapter, 'StoryRepository', ['findAll', 'findById', 'save']);

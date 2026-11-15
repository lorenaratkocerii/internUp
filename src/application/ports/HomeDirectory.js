import { assertPort } from './assertPort';

export const asHomeDirectory = (adapter) =>
  assertPort(adapter, 'HomeDirectory', ['getSearchOptions', 'listUniversities', 'listStories']);

import { assertPort } from './assertPort';

export const asStatsRepository = (adapter) =>
  assertPort(adapter, 'StatsRepository', ['getPlatformStats']);

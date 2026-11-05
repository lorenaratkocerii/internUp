import { createPlatformStat } from '../../../domain/internship/PlatformStat';
import { statRecords } from './mockData';

export function createMockStatsRepository(records = statRecords) {
  const stats = records.map(createPlatformStat);

  return {
    getPlatformStats: async () => stats,
  };
}

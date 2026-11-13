import { createPlatformStat } from '../../../domain/internship/PlatformStat';
import { companyRecords, internshipRecords } from './mockData';
import { storyRecords } from './storyData';
import { universityRecords } from './universityData';

const countedRecords = () => [
  { id: 'internships', value: internshipRecords.length, label: 'Praktika' },
  { id: 'companies', value: companyRecords.length, label: 'Kompani' },
  { id: 'universities', value: universityRecords.length, label: 'Universitete dhe kolegje' },
  { id: 'stories', value: storyRecords.length, label: 'Histori nga studentët' },
];

export function createMockStatsRepository(records = countedRecords()) {
  const stats = records.map(createPlatformStat);

  return {
    getPlatformStats: async () => stats,
  };
}

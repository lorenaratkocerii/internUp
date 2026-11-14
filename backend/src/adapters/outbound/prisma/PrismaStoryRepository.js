import { storyInclude, toStory } from './mappers/storyMapper.js';

export function createPrismaStoryRepository(prisma) {
  return {
    findLatest: async (limit) => {
      const records = await prisma.story.findMany({
        include: storyInclude,
        orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
        take: limit,
      });
      return records.map(toStory);
    },
    count: () => prisma.story.count(),
  };
}

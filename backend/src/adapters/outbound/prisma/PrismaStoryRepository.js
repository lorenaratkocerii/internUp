import { storyInclude, toStory } from './mappers/storyMapper.js';

export const homeStoryOrder = [{ featured: 'desc' }, { publishedAt: 'desc' }, { id: 'asc' }];

export function createPrismaStoryRepository(prisma) {
  return {
    findLatest: async (limit) => {
      const records = await prisma.story.findMany({
        include: storyInclude,
        orderBy: homeStoryOrder,
        take: limit,
      });
      return records.map(toStory);
    },
    count: () => prisma.story.count(),
  };
}

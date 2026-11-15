import { homeStoryOrder } from './PrismaStoryRepository.js';

const NOT_FOUND = 'P2025';

const toIsoDay = (date) => date.toISOString().slice(0, 10);

const toCompany = (record) => ({
  id: record.slug,
  name: record.name,
  industry: record.industry,
  location: record.city.name,
  isPartner: record.isPartner,
  displayOrder: record.displayOrder,
});

const toInternship = (record) => ({
  id: record.slug,
  title: record.title,
  company: record.company.name,
  location: record.city.name,
  closesAt: toIsoDay(record.closesAt),
  featured: record.featured,
});

const toStory = (record) => ({
  id: record.slug,
  title: record.title,
  excerpt: record.excerpt,
  authorName: record.anonymous ? '' : record.authorName ?? '',
  companyName: record.company?.name ?? '',
  publishedAt: record.publishedAt.toISOString(),
  featured: record.featured,
});

async function updateBySlug(model, slug, data) {
  try {
    await model.update({ where: { slug }, data });
    return true;
  } catch (error) {
    if (error?.code === NOT_FOUND) return false;
    throw error;
  }
}

export function createPrismaHomeContentRepository(prisma) {
  return {
    listCompanies: async () => {
      const records = await prisma.company.findMany({
        include: { city: { select: { name: true } } },
        orderBy: [{ isPartner: 'desc' }, { displayOrder: 'asc' }, { id: 'asc' }],
      });
      return records.map(toCompany);
    },

    listInternships: async () => {
      const records = await prisma.internship.findMany({
        include: { company: { select: { name: true } }, city: { select: { name: true } } },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
      });
      return records.map(toInternship);
    },

    listStories: async () => {
      const records = await prisma.story.findMany({
        include: { company: { select: { name: true } } },
        orderBy: homeStoryOrder,
      });
      return records.map(toStory);
    },

    updateCompany: (slug, data) => updateBySlug(prisma.company, slug, data),
    updateInternship: (slug, data) => updateBySlug(prisma.internship, slug, data),
    updateStory: (slug, data) => updateBySlug(prisma.story, slug, data),

    setPartnerOrder: async (slugs) => {
      const existing = await prisma.company.count({ where: { slug: { in: slugs } } });
      if (existing !== slugs.length) return false;

      await prisma.$transaction([
        prisma.company.updateMany({ where: { slug: { notIn: slugs } }, data: { isPartner: false } }),
        ...slugs.map((slug, index) =>
          prisma.company.update({ where: { slug }, data: { isPartner: true, displayOrder: index + 1 } }),
        ),
      ]);
      return true;
    },
  };
}

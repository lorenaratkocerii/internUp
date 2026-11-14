export function createPrismaCityRepository(prisma) {
  return {
    findAllNames: async () => {
      const records = await prisma.city.findMany({ select: { name: true } });
      return records.map((city) => city.name);
    },
  };
}

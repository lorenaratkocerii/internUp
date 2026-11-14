import { PrismaClient } from '@prisma/client';

export function createPrismaClient({ databaseUrl, nodeEnv }) {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
    log: nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
  });
}

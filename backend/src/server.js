import { env } from './infrastructure/config/env.js';
import { createContainer } from './infrastructure/container.js';
import { createPrismaClient } from './infrastructure/database/prismaClient.js';
import { createApp } from './infrastructure/http/createApp.js';

const prisma = createPrismaClient(env);
const { controllers } = createContainer({ prisma });
const app = createApp({ controllers, corsOrigins: env.corsOrigins });

const server = app.listen(env.port, () => {
  console.log(`InternUp API po dëgjon në http://localhost:${env.port}/api`);
});

server.on('error', (error) => {
  console.error('Serveri nuk u nis:', error.message);
  process.exit(1);
});

async function shutdown(signal) {
  console.log(`${signal}: po mbyllet serveri...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

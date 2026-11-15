import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { createScryptPasswordHasher } from '../../src/adapters/outbound/security/ScryptPasswordHasher.js';
import { MIN_PASSWORD_LENGTH, normalizeEmail } from '../../src/domain/admin/Admin.js';

export async function seedAdmin(prisma) {
  const email = normalizeEmail(process.env.ADMIN_EMAIL);
  const password = process.env.ADMIN_PASSWORD ?? '';
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator';

  if (!email || !password) {
    console.warn('Admini nuk u krijua: vendos ADMIN_EMAIL dhe ADMIN_PASSWORD te .env.');
    return null;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD duhet të ketë të paktën ${MIN_PASSWORD_LENGTH} karaktere.`);
  }

  const passwordHash = await createScryptPasswordHasher().hash(password);
  await prisma.admin.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
  return email;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const prisma = new PrismaClient();
  seedAdmin(prisma)
    .then((email) => {
      if (email) console.log(`Admini u ruajt: ${email}`);
    })
    .catch((error) => {
      console.error('Krijimi i adminit dështoi:', error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

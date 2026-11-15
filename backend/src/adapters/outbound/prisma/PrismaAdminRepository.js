import { createAdmin } from '../../../domain/admin/Admin.js';

const toAdmin = (record) => createAdmin({ id: record.id, email: record.email, name: record.name });

export function createPrismaAdminRepository(prisma) {
  return {
    findCredentialsByEmail: async (email) => {
      const record = await prisma.admin.findUnique({ where: { email } });
      return record ? { admin: toAdmin(record), passwordHash: record.passwordHash } : null;
    },

    findById: async (id) => {
      if (!Number.isInteger(id)) return null;
      const record = await prisma.admin.findUnique({ where: { id } });
      return record ? toAdmin(record) : null;
    },

    recordLogin: async (id, at) => {
      await prisma.admin.update({ where: { id }, data: { lastLoginAt: at } });
    },
  };
}

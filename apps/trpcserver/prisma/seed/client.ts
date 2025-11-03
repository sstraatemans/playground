import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;
// Prevent multiple instances in dev
if (!(globalThis as any).prisma) {
  (globalThis as any).prisma = new PrismaClient();
}
prisma = (globalThis as any).prisma;

export default prisma;

import { PrismaClient } from '@prisma/client';
import albums from './data/albums';

const prisma = new PrismaClient();

async function main() {
  // -------------------------------------------------
  // 1. Wipe everything (optional – only for dev!)
  // -------------------------------------------------
  await prisma.$executeRaw`TRUNCATE TABLE "Album" RESTART IDENTITY CASCADE;`;

  const promises = albums.map(async (album) => {
    console.log(album);
    return prisma.album.upsert({
      where: { id: album.id },
      update: {},
      create: album,
    });
  });

  await Promise.all(promises);

  console.log('🌱 Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

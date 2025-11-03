import prisma from './client';
import albums from './data/albums';

async function main() {
  await prisma.$transaction(
    albums.map((album) =>
      prisma.album.upsert({
        where: { id: album.id },
        update: album,
        create: album,
      })
    )
  );

  console.log('🌱 Seed completed');
}

main().finally(async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

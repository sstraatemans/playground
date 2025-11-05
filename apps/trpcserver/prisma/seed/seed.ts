import prisma from './client';
import albums from './data/albums';
import characters from './data/characters';
import series from './data/series';

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

  await prisma.$transaction(
    series.map((serie) =>
      prisma.serie.upsert({
        where: { id: serie.id },
        update: serie,
        create: serie,
      })
    )
  );

  await prisma.$transaction(
    characters.map((character) =>
      prisma.character.upsert({
        where: { id: character.id },
        update: character,
        create: character,
      })
    )
  );

  console.log('🌱 Seed completed');
}

main().finally(async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

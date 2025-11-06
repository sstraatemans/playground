import { connectAlbum2Series } from '../../src/db/albums/connectAlbum2Series';
import series from '../../src/server/utils/data/series';
import { getAlbumsJson } from '../../src/server/utils/getAlbumsJson';
import { getCharactersJson } from '../../src/server/utils/getCharactersJson';
import prisma from './client';

async function main() {
  const albums = await getAlbumsJson();
  const characters = await getCharactersJson();
  if (!albums.length) {
    console.log('No albums found to seed.');
    return;
  }
  if (!characters.length) {
    console.log('No characters found to seed.');
    return;
  }

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
    albums.map((album) => {
      const a = { id: album.id, title: album.title, date: album.date };
      return prisma.album.upsert({
        where: { id: a.id },
        update: a,
        create: a,
      });
    })
  );

  await prisma.$transaction(
    characters.map((character) => {
      const c = {
        id: character.id,
        name: character.name,
        description: character.description,
        years: character.years,
        albumsTemp: character.albumsTemp,
      };
      return prisma.character.upsert({
        where: { name: c.name },
        update: c,
        create: c,
      });
    })
  );

  //add series relations to albums
  const promises = albums.map(async (album) => {
    return await connectAlbum2Series(album, series);
  });

  await Promise.allSettled(promises);

  console.log('🌱 Seed completed');
}

main().finally(async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

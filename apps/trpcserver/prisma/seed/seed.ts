import { connectAlbum2Series } from '../../src/db/albums/connectAlbum2Series';
import series from '../../src/server/utils/data/series';
import { getAlbumsJson } from '../../src/server/utils/getAlbumsJson';
import prisma from './client';

//import characters from './data/characters';

async function main() {
  const albums = await getAlbumsJson();
  if (!albums.length) {
    console.log('No albums found to seed.');
    return;
  }

  // await prisma.$transaction(
  //   series.map((serie) =>
  //     prisma.serie.upsert({
  //       where: { id: serie.id },
  //       update: serie,
  //       create: serie,
  //     })
  //   )
  // );

  // await prisma.$transaction(
  //   albums.map((album) => {
  //     const a = { id: album.id, title: album.title, date: album.date };
  //     return prisma.album.upsert({
  //       where: { id: a.id },
  //       update: a,
  //       create: a,
  //     });
  //   })
  // );

  // await prisma.$transaction(
  //   characters.map((character) =>
  //     prisma.character.upsert({
  //       where: { id: character.id },
  //       update: character,
  //       create: character,
  //     })
  //   )
  // );

  // add series relations to albums
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

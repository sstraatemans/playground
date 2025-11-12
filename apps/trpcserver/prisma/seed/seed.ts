import { connectAlbum2Collections } from '../../src/db/albums/connectAlbum2Collections';
import artists from '../../src/server/utils/data/artists';
import collections from '../../src/server/utils/data/collections';
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
    collections.map((collection) => {
      return prisma.collection.upsert({
        where: { id: collection.id },
        update: collection,
        create: collection,
      });
    })
  );

  await prisma.$transaction(
    artists.map((artist) => {
      return prisma.artist.upsert({
        where: { id: artist.id },
        update: artist,
        create: artist,
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
        wikiURL: character.wikiURL,
      };

      return prisma.character.upsert({
        where: { name: c.name },
        update: c,
        create: c,
      });
    })
  );

  await prisma.$transaction(
    albums.map((album) => {
      const a = {
        id: album.id,
        title: album.title,
        date: album.date,
        wikiURL: album.wikiURL,
      };

      return prisma.album.upsert({
        where: { id: a.id },
        update: a,
        create: a,
      });
    })
  );

  //add collections relations to albums
  const promises = albums
    .sort((a, b) => {
      if (a.id < b.id) return -1;
      return 1;
    })
    .map(async (album) => {
      return await connectAlbum2Collections(album, collections);
    });

  await Promise.allSettled(promises);

  console.log('🌱 Seed completed');
}

main().finally(async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

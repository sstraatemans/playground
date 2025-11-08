import type { Collection } from '@prisma/client';
import type { WikiAlbum } from 'server/utils/getAlbumsJson.js';
import { prisma } from '../../db/client.js';

export const connectAlbum2Collections = async (
  album: WikiAlbum,
  collectionsData: readonly Readonly<Collection>[]
) => {
  const promises = collectionsData.map(async (collection) => {
    const hasCollection = (album as any)[collection.id];
    if (hasCollection) {
      await prisma.collectionAlbum.upsert({
        where: {
          albumId_collectionId: {
            albumId: album.id,
            collectionId: collection.id,
          },
        },
        update: {
          albumId: album.id,
          collectionId: collection.id,
          number: Number(hasCollection),
        },
        create: {
          albumId: album.id,
          collectionId: collection.id,
          number: Number(hasCollection),
        },
      });
    } else {
      prisma.collectionAlbum.deleteMany({
        where: { albumId: album.id, collectionId: collection.id },
      });
    }
  });

  return Promise.allSettled(promises);
};

import type { CollectionAlbum } from '@prisma/client';
import { prisma } from '../client.js';

export const getCollectionAlbumsById = async (
  id: string
): Promise<CollectionAlbum[]> => {
  if (Array.isArray(id)) {
    const promises = id.map((singleId) => getCollectionAlbumsById(singleId));
    const results = await Promise.all(promises);
    return results.flat();
  }
  const albums = await prisma.collection.findMany({
    where: {
      collectionAlbums: {
        some: {
          collectionId: id,
        },
      },
    },
    include: {
      collectionAlbums: {
        where: {
          collectionId: id, // limits to the relevant junction per collections
        },
      },
    },
  });

  const convertedAlbums = albums
    .map((album) => {
      const { collectionAlbums } = album;
      return collectionAlbums;
    })
    .flat();

  return convertedAlbums;
};

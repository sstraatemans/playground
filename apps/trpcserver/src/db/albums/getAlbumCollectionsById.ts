import { prisma } from '../client.js';

export const getAlbumCollectionsById = async (id: number) => {
  const collections = await prisma.collection.findMany({
    where: {
      collectionAlbums: {
        some: {
          albumId: id,
        },
      },
    },
    include: {
      collectionAlbums: {
        where: {
          albumId: id, // limits to the relevant junction per collections
        },
      },
    },
  });

  const convertedCollections = collections.map((collection) => {
    const { collectionAlbums } = collection;
    return collectionAlbums;
  });

  return convertedCollections;
};

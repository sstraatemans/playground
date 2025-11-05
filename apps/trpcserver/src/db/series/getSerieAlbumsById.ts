import type { SerieAlbum } from '@prisma/client';
import { prisma } from '../client.js';

export const getSerieAlbumsById = async (id: string): Promise<SerieAlbum[]> => {
  if (Array.isArray(id)) {
    const promises = id.map((singleId) => getSerieAlbumsById(singleId));
    const results = await Promise.all(promises);
    return results.flat();
  }
  const albums = await prisma.serie.findMany({
    where: {
      serieAlbums: {
        some: {
          serieId: id,
        },
      },
    },
    include: {
      serieAlbums: {
        where: {
          serieId: id, // limits to the relevant junction per series
        },
      },
    },
  });

  const convertedAlbums = albums
    .map((album) => {
      const { serieAlbums } = album;
      return serieAlbums;
    })
    .flat();

  return convertedAlbums;
};

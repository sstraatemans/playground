import { prisma } from '../client.js';

export const getAlbumSeriesById = async (id: number) => {
  const series = await prisma.serie.findMany({
    where: {
      serieAlbums: {
        some: {
          albumId: id,
        },
      },
    },
    include: {
      serieAlbums: {
        where: {
          albumId: id, // limits to the relevant junction per series
        },
      },
    },
  });

  const convertedSeries = series.map((serie) => {
    const { serieAlbums } = serie;
    return serieAlbums;
  });

  return convertedSeries;
};

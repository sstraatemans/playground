import type { Serie } from '@prisma/client';
import { prisma } from 'db/client.js';
import type { WikiAlbum } from 'server/utils/getAlbumsJson.js';

export const connectAlbum2Series = async (
  album: WikiAlbum,
  seriesData: readonly Readonly<Serie>[]
) => {
  const promises = seriesData.map(async (serie) => {
    const hasSerie = (album as any)[serie.id];
    if (hasSerie) {
      await prisma.serieAlbum.upsert({
        where: {
          albumId_serieId: {
            albumId: album.id,
            serieId: serie.id,
          },
        },
        update: {
          albumId: album.id,
          serieId: serie.id,
          number: Number(hasSerie),
        },
        create: {
          albumId: album.id,
          serieId: serie.id,
          number: Number(hasSerie),
        },
      });
    } else {
      prisma.serieAlbum.deleteMany({
        where: { albumId: album.id, serieId: serie.id },
      });
    }
  });

  return Promise.allSettled(promises);
};

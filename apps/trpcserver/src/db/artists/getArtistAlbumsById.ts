import { prisma } from '../client.js';

export const getArtistAlbumsById = async (id: number) => {
  const albums = await prisma.album.findMany({
    where: {
      OR: [
        {
          scenarioArtistId: id,
        },
        {
          drawArtistId: id,
        },
      ],
    },
  });

  return albums;
};

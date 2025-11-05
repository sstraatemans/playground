import { prisma } from '../client.js';

export const getCharactersAlbumsById = async (id: number) => {
  const albums = await prisma.album.findMany({
    where: {
      characters: {
        some: {
          id,
        },
      },
    },
  });

  return albums;
};

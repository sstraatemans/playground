import { prisma } from '../client.js';

export const getAlbumCharactersById = async (id: number) => {
  const characters = await prisma.character.findMany({
    where: {
      albums: {
        some: {
          id,
        },
      },
    },
  });

  return characters;
};

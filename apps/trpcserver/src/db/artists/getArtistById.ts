import { prisma } from '../client.js';

export const getArtistById = async (id: number) => {
  const data = await prisma.artist.findUnique({ where: { id } });
  return data;
};

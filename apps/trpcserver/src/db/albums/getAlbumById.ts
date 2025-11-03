import { prisma } from '../client.js';

export const getAlbumById = async (id: number) => {
  const data = await prisma.album.findUnique({ where: { id } });
  return data;
};

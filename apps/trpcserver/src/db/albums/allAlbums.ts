import { prisma } from '../client.js';

export const allAlbums = async () => {
  const data = await prisma.album.findMany({ orderBy: { id: 'asc' } });
  return data;
};

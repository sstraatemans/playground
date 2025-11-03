import { prisma } from '../client.js';

export const allAlbums = async () => {
  const data = await prisma.album.findMany();
  return data;
};

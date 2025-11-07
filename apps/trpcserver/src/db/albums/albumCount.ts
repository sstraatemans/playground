import { prisma } from 'db/client.js';

export const albumCount = async () => {
  const count = await prisma.album.count();
  return count;
};

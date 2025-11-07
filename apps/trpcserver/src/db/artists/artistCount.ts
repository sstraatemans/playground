import { prisma } from 'db/client.js';

export const artistCount = async () => {
  const count = await prisma.artist.count();
  return count;
};

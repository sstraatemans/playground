import { prisma } from '../client.js';

export const artistCount = async () => {
  const count = await prisma.artist.count();
  return count;
};

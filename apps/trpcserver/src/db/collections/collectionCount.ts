import { prisma } from '../client.js';

export const collectionCount = async () => {
  const count = await prisma.collection.count();
  return count;
};

import { prisma } from '../client.js';

export const serieCount = async () => {
  const count = await prisma.serie.count();
  return count;
};

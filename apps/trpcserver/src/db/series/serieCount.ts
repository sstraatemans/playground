import { prisma } from 'db/client.js';

export const serieCount = async () => {
  const count = await prisma.serie.count();
  return count;
};

import { prisma } from '../client.js';

export const allSeries = async () => {
  const data = await prisma.serie.findMany();
  return data;
};

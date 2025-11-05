import { prisma } from '../client.js';

export const allSeries = async () => {
  const data = await prisma.serie.findMany({ orderBy: { name: 'asc' } });
  return data;
};

import { prisma } from '../client.js';

export const getSerieById = async (id: string) => {
  const data = await prisma.serie.findUnique({ where: { id } });
  return data;
};

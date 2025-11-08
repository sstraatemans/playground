import { prisma } from '../client.js';

export const getCollectionById = async (id: string) => {
  const data = await prisma.collection.findUnique({ where: { id } });
  return data;
};

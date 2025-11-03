import { prisma } from '../client.js';

export const allCharacters = async () => {
  const data = await prisma.character.findMany({ orderBy: { name: 'asc' } });
  return data;
};

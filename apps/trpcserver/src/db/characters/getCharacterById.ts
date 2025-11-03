import { prisma } from '../client.js';

export const getCharacterById = async (id: number) => {
  const data = await prisma.character.findUnique({ where: { id } });
  return data;
};

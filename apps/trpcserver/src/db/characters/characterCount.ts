import { prisma } from '../client.js';

export const characterCount = async () => {
  const count = await prisma.character.count();
  return count;
};

import { prisma } from 'db/client.js';

export const characterCount = async () => {
  const count = await prisma.character.count();
  return count;
};

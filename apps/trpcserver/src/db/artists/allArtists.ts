import { prisma } from '../client.js';

export const allArtists = async () => {
  const data = await prisma.artist.findMany({ orderBy: { name: 'asc' } });
  return data;
};

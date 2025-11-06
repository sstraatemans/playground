import { prisma } from '../../db/client.js';

export const findArtistByName = async (name: string) => {
  const artists = await prisma.artist.findMany();

  return artists.find((artist) => artist.name === name);
};

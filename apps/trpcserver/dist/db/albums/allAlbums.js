import { prisma } from '../client.js';
export const allAlbums = async () => {
    const data = await prisma.album.findMany({ orderBy: { number: 'asc' } });
    return data;
};

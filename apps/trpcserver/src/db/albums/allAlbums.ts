import z from 'zod';
import { CONSTANTS } from '../../constants.js';
import { prisma } from '../client.js';
import { albumCount } from './albumCount.js';

export interface AllAlbumsParams {
  offset?: number;
  limit?: number;
}

export const AllAlbumsSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();

export const allAlbums = async ({
  offset = CONSTANTS.DEFAULT_OFFSET,
  limit = CONSTANTS.DEFAULT_LIMIT,
}: AllAlbumsParams = {}) => {
  if (offset < 0) offset = CONSTANTS.DEFAULT_OFFSET;
  if (limit < 1 || limit > CONSTANTS.DEFAULT_LIMIT)
    limit = CONSTANTS.DEFAULT_LIMIT;

  const data = await prisma.album.findMany({
    skip: offset,
    take: limit,
    orderBy: { id: 'asc' },
  });
  return { totalCount: await albumCount(), data: data };
};

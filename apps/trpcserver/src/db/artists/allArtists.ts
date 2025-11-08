import z from 'zod';
import { CONSTANTS } from '../../constants.js';
import { prisma } from '../client.js';
import { artistCount } from './artistCount.js';

export interface AllArtistsParams {
  offset?: number;
  limit?: number;
}

export const AllArtistsSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();

export const allArtists = async ({
  offset = CONSTANTS.DEFAULT_OFFSET,
  limit = CONSTANTS.DEFAULT_LIMIT,
}: AllArtistsParams = {}) => {
  if (offset < 0) offset = CONSTANTS.DEFAULT_OFFSET;
  if (limit < 1 || limit > CONSTANTS.DEFAULT_LIMIT)
    limit = CONSTANTS.DEFAULT_LIMIT;

  const data = await prisma.artist.findMany({
    skip: offset,
    take: limit,
    orderBy: { id: 'asc' },
  });
  return { totalCount: await artistCount(), data: data };
};

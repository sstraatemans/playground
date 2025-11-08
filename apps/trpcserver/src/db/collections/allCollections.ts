import z from 'zod';
import { CONSTANTS } from '../../constants.js';
import { prisma } from '../client.js';
import { collectionCount } from './collectionCount.js';

export interface AllCollectionsParams {
  offset?: number;
  limit?: number;
}

export const AllCollectionsSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();

export const allCollections = async ({
  offset = CONSTANTS.DEFAULT_OFFSET,
  limit = CONSTANTS.DEFAULT_LIMIT,
}: AllCollectionsParams = {}) => {
  if (offset < 0) offset = CONSTANTS.DEFAULT_OFFSET;
  if (limit < 1 || limit > CONSTANTS.DEFAULT_LIMIT)
    limit = CONSTANTS.DEFAULT_LIMIT;

  const data = await prisma.collection.findMany({
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' },
  });
  return { totalCount: await collectionCount(), data };
};

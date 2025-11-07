import { CONSTANTS } from 'constants.js';
import z from 'zod';
import { prisma } from '../client.js';
import { serieCount } from './serieCount.js';

export interface AllSeriessParams {
  offset?: number;
  limit?: number;
}

export const AllSeriessSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();

export const allSeries = async ({
  offset = CONSTANTS.DEFAULT_OFFSET,
  limit = CONSTANTS.DEFAULT_LIMIT,
}: AllSeriessParams = {}) => {
  if (offset < 0) offset = CONSTANTS.DEFAULT_OFFSET;
  if (limit < 1 || limit > CONSTANTS.DEFAULT_LIMIT)
    limit = CONSTANTS.DEFAULT_LIMIT;

  const data = await prisma.serie.findMany({
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' },
  });
  return { totalCount: await serieCount(), series: data };
};

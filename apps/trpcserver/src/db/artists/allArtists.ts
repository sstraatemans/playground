import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { getCacheStrategy } from 'utils/getCacheStrategy.js';
import z from 'zod';
import { CONSTANTS } from '../../constants.js';
import { logger } from '../../utils/logger.js';
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

/**
 * Get a paginated list of all artists in the database.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data } = trpc.artist.all.useQuery({ offset: 0, limit: 10 });
 *   // → { totalCount: 25, data: [...] }
 *
 *   // Server-side
 *   const artists = await ctx.artist.all({ offset: 0, limit: 10 });
 *   // → { totalCount: 25, data: [...] }
 *
 * @param {AllArtistsParams} params - Pagination parameters
 * @param {number} [params.offset=0] - Number of records to skip (negative values default to 0)
 * @param {number} [params.limit=100] - Maximum number of records to return (clamped to 1-100)
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<{ totalCount: number; data: Artist[] }>} Paginated artist list with total count
 */
export const allArtists = async ({
  offset = CONSTANTS.DEFAULT_OFFSET,
  limit = CONSTANTS.DEFAULT_LIMIT,
}: AllArtistsParams = {}) => {
  if (offset < 0) offset = CONSTANTS.DEFAULT_OFFSET;
  if (limit < 1 || limit > CONSTANTS.DEFAULT_LIMIT)
    limit = CONSTANTS.DEFAULT_LIMIT;

  try {
    const data = await prisma.artist.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: 'asc' },
      ...getCacheStrategy(),
    });
    return { totalCount: await artistCount(), data: data };
  } catch (error) {
    logger.error(
      {
        code: error instanceof PrismaClientKnownRequestError ? error.code : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        offset,
        limit,
      },
      'Failed to retrieve artists'
    );

    if (error instanceof PrismaClientKnownRequestError) {
      // P1001 = can't reach DB, P1003 = connection timeout, etc.
      if (['P1001', 'P1002', 'P1003', 'P1017'].includes(error.code)) {
        throw new TRPCError({
          code: 'SERVICE_UNAVAILABLE',
          message: 'Database is temporarily unavailable',
          cause: error,
        });
      }
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve artists',
      cause: error,
    });
  }
};

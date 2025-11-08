import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get the total number of artists in the database.
 * This procedure is safe to call unauthenticated (public) and is cached
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: count } = trpc.artist.count.useQuery();
 *   // → count = 25
 *
 *   // Server-side
 *   const count = await ctx.artist.count();
 *   // → 25
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<number>} Total number of artists (always >= 0)
 */
export const artistCount = async (): Promise<number> => {
  try {
    const count = await prisma.artist.count();
    return count;
  } catch (error) {
    logger.error(
      {
        code:
          error instanceof Prisma.PrismaClientKnownRequestError
            ? error.code
            : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Failed to retrieve artist count'
    );

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
      message: 'Failed to retrieve artist count',
      cause: error,
    });
  }
};

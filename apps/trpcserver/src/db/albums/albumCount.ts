import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get the total number of albums in the database.
 * This procedure is safe to call unauthenticated (public) and is cached
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: count } = trpc.album.count.useQuery();
 *   // → count = 42
 *
 *   // Server-side
 *   const count = await ctx.album.count();
 *   // → 42
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<number>} Total number of albums (always >= 0)
 */
export const albumCount = async (): Promise<number> => {
  try {
    const count = await prisma.album.count();
    return count;
  } catch (error) {
    logger.error(
      {
        code:
          error instanceof PrismaClientKnownRequestError
            ? error.code
            : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Failed to retrieve album count'
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
      message: 'Failed to retrieve album count',
      cause: error,
    });
  }
};

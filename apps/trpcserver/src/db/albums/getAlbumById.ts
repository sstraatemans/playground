import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { getCacheStrategy } from 'utils/getCacheStrategy.js';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get a single album by its ID.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: album } = trpc.album.byId.useQuery({ id: 1 });
 *   // → { id: 1, title: "Tintin in America", ... }
 *
 *   // Server-side
 *   const album = await ctx.album.byId({ id: 1 });
 *   // → { id: 1, title: "Tintin in America", ... }
 *
 * @param {number} id - The unique ID of the album to retrieve
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `NOT_FOUND` – No album exists with the given ID
 *   - `BAD_REQUEST` – Invalid ID provided
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<Album | null>} The album if found, null otherwise
 */
export const getAlbumById = async (id: number) => {
  try {
    const data = await prisma.album.findUnique({
      where: { id },
      ...getCacheStrategy(),
    });
    return data;
  } catch (error) {
    logger.error(
      {
        code: error instanceof PrismaClientKnownRequestError ? error.code : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id,
      },
      'Failed to retrieve album by ID'
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
      message: 'Failed to retrieve album by ID',
      cause: error,
    });
  }
};

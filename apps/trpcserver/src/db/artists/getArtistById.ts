import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { getCacheStrategy } from '../../utils/getCacheStrategy.js';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get a single artist by their ID.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: artist } = trpc.artist.byId.useQuery({ id: 1 });
 *   // → { id: 1, name: "Hergé", ... }
 *
 *   // Server-side
 *   const artist = await ctx.artist.byId({ id: 1 });
 *   // → { id: 1, name: "Hergé", ... }
 *
 * @param {number} id - The unique ID of the artist to retrieve
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<Artist | null>} The artist if found, null otherwise
 */
export const getArtistById = async (id: number) => {
  try {
    const data = await prisma.artist.findUnique({
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
      'Failed to retrieve artist by ID'
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
      message: 'Failed to retrieve artist by ID',
      cause: error,
    });
  }
};

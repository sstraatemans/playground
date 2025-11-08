import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get all albums associated with a specific artist.
 * Returns albums where the artist is either the scenario writer or the illustrator.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: albums } = trpc.artist.albums.useQuery({ id: 1 });
 *   // → [{ id: 1, title: "Tintin in America", ... }, ...]
 *
 *   // Server-side
 *   const albums = await ctx.artist.albums({ id: 1 });
 *   // → [{ id: 1, title: "Tintin in America", ... }, ...]
 *
 * @param {number} id - The unique ID of the artist
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<Album[]>} Array of albums by the artist (empty array if none)
 */
export const getArtistAlbumsById = async (id: number) => {
  try {
    const albums = await prisma.album.findMany({
      where: {
        OR: [
          {
            scenarioArtistId: id,
          },
          {
            drawArtistId: id,
          },
        ],
      },
    });

    return albums;
  } catch (error) {
    logger.error(
      {
        code:
          error instanceof Prisma.PrismaClientKnownRequestError
            ? error.code
            : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id,
      },
      'Failed to retrieve artist albums'
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
      message: 'Failed to retrieve artist albums',
      cause: error,
    });
  }
};

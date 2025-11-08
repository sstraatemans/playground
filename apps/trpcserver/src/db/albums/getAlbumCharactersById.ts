import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get all characters associated with a specific album.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: characters } = trpc.album.characters.useQuery({ id: 1 });
 *   // → [{ id: 1, name: "Tintin", ... }, { id: 2, name: "Snowy", ... }]
 *
 *   // Server-side
 *   const characters = await ctx.album.characters({ id: 1 });
 *   // → [{ id: 1, name: "Tintin", ... }, { id: 2, name: "Snowy", ... }]
 *
 * @param {number} id - The unique ID of the album
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<Character[]>} Array of characters appearing in the album (empty array if none)
 */
export const getAlbumCharactersById = async (id: number) => {
  try {
    const characters = await prisma.character.findMany({
      where: {
        albumCharacters: {
          some: {
            albumId: id,
          },
        },
      },
    });

    return characters;
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
      'Failed to retrieve album characters'
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
      message: 'Failed to retrieve album characters',
      cause: error,
    });
  }
};

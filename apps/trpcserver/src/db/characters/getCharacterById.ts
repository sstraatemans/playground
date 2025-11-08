import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get a single character by their ID.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: character } = trpc.character.byId.useQuery({ id: 1 });
 *   // → { id: 1, name: "Tintin", ... }
 *
 *   // Server-side
 *   const character = await ctx.character.byId({ id: 1 });
 *   // → { id: 1, name: "Tintin", ... }
 *
 * @param {number} id - The unique ID of the character to retrieve
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<Character | null>} The character if found, null otherwise
 */
export const getCharacterById = async (id: number) => {
  try {
    const data = await prisma.character.findUnique({ where: { id } });
    return data;
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
      'Failed to retrieve character by ID'
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
      message: 'Failed to retrieve character by ID',
      cause: error,
    });
  }
};

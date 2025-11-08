import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get a single collection by its ID.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: collection } = trpc.collection.byId.useQuery({ id: "tintin" });
 *   // → { id: "tintin", name: "The Adventures of Tintin", ... }
 *
 *   // Server-side
 *   const collection = await ctx.collection.byId({ id: "tintin" });
 *   // → { id: "tintin", name: "The Adventures of Tintin", ... }
 *
 * @param {string} id - The unique ID of the collection to retrieve
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<Collection | null>} The collection if found, null otherwise
 */
export const getCollectionById = async (id: string) => {
  try {
    const data = await prisma.collection.findUnique({ where: { id } });
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
      'Failed to retrieve collection by ID'
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
      message: 'Failed to retrieve collection by ID',
      cause: error,
    });
  }
};

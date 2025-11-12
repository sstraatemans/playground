import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { getCacheStrategy } from '../../utils/getCacheStrategy.js';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get all collections that include a specific album.
 * Returns the junction table records (CollectionAlbum) which include both
 * the collection reference and the album's number within that collection.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: collections } = trpc.album.collections.useQuery({ id: 1 });
 *   // → [[{ albumId: 1, collectionId: 5, number: 3 }], ...]
 *
 *   // Server-side
 *   const collections = await ctx.album.collections({ id: 1 });
 *   // → [[{ albumId: 1, collectionId: 5, number: 3 }], ...]
 *
 * @param {number} id - The unique ID of the album
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<CollectionAlbum[][]>} Array of collection-album junction records grouped by collection
 */
export const getAlbumCollectionsById = async (id: number) => {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        collectionAlbums: {
          some: {
            albumId: id,
          },
        },
      },
      include: {
        collectionAlbums: {
          where: {
            albumId: id, // limits to the relevant junction per collections
          },
        },
      },
      ...getCacheStrategy(),
    });

    const convertedCollections = collections.map((collection) => {
      const { collectionAlbums } = collection;
      return collectionAlbums;
    });

    return convertedCollections.flat();
  } catch (error) {
    logger.error(
      {
        code: error instanceof PrismaClientKnownRequestError ? error.code : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id,
      },
      'Failed to retrieve album collections'
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
      message: 'Failed to retrieve album collections',
      cause: error,
    });
  }
};

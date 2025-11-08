import type { CollectionAlbum } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '../../utils/logger.js';
import { prisma } from '../client.js';

/**
 * Get all albums in a specific collection (or multiple collections).
 * Returns the junction table records (CollectionAlbum) which include both
 * the album reference and its number within the collection.
 * This procedure is safe to call unauthenticated (public).
 *
 * @example
 *   // Client-side (tRPC React/Query)
 *   const { data: albums } = trpc.collection.albums.useQuery({ id: "tintin" });
 *   // → [{ albumId: 1, collectionId: "tintin", number: 1 }, ...]
 *
 *   // Server-side
 *   const albums = await ctx.collection.albums({ id: "tintin" });
 *   // → [{ albumId: 1, collectionId: "tintin", number: 1 }, ...]
 *
 * @param {string} id - The unique ID of the collection (or array of IDs)
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<CollectionAlbum[]>} Array of collection-album junction records (flattened if multiple collections)
 */
export const getCollectionAlbumsById = async (
  id: string
): Promise<CollectionAlbum[]> => {
  if (Array.isArray(id)) {
    const promises = id.map((singleId) => getCollectionAlbumsById(singleId));
    const results = await Promise.all(promises);
    return results.flat();
  }

  try {
    const albums = await prisma.collection.findMany({
      where: {
        collectionAlbums: {
          some: {
            collectionId: id,
          },
        },
      },
      include: {
        collectionAlbums: {
          where: {
            collectionId: id, // limits to the relevant junction per collections
          },
        },
      },
    });

    const convertedAlbums = albums
      .map((album) => {
        const { collectionAlbums } = album;
        return collectionAlbums;
      })
      .flat();

    return convertedAlbums;
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
      'Failed to retrieve collection albums'
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
      message: 'Failed to retrieve collection albums',
      cause: error,
    });
  }
};

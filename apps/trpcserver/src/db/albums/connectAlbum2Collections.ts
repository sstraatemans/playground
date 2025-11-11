import type { Collection } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import type { WikiAlbum } from 'server/utils/getAlbumsJson.js';
import { prisma } from '../../db/client.js';
import { logger } from '../../utils/logger.js';

/**
 * THIS SHOULD NOT BE CONNECTED IN THE ROUTE, THIS IS ONLY FOR SEEDING PURPOSES
 * Connect an album to its collections by creating or updating junction table records.
 * This function handles both adding albums to collections and removing them when needed.
 * This is typically used during album data synchronization from external sources.
 *
 * @example
 *   // Server-side only (not exposed as tRPC procedure)
 *   const results = await connectAlbum2Collections(album, collections);
 *   // → Promise.allSettled results array
 *
 * @param {WikiAlbum} album - The album to connect to collections
 * @param {readonly Readonly<Collection>[]} collectionsData - Array of all available collections
 *
 * @throws {TRPCError} Only throws typed tRPC errors:
 *   - `INTERNAL_SERVER_ERROR` – unexpected Prisma/error
 *   - `SERVICE_UNAVAILABLE` – Prisma can't connect
 *
 * @returns {Promise<PromiseSettledResult<void>[]>} Array of settled promise results
 */
export const connectAlbum2Collections = async (
  album: WikiAlbum,
  collectionsData: readonly Readonly<Collection>[]
) => {
  try {
    const promises = collectionsData.map(async (collection) => {
      const hasCollection = (album as any)[collection.id];
      if (hasCollection) {
        await prisma.collectionAlbum.upsert({
          where: {
            albumId_collectionId: {
              albumId: album.id,
              collectionId: collection.id,
            },
          },
          update: {
            albumId: album.id,
            collectionId: collection.id,
            number: Number(hasCollection),
          },
          create: {
            albumId: album.id,
            collectionId: collection.id,
            number: Number(hasCollection),
          },
        });
      } else {
        await prisma.collectionAlbum.deleteMany({
          where: { albumId: album.id, collectionId: collection.id },
        });
      }
    });

    return Promise.allSettled(promises);
  } catch (error) {
    logger.error(
      {
        code:
          error instanceof PrismaClientKnownRequestError
            ? error.code
            : '',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        albumId: album.id,
        collectionsCount: collectionsData.length,
      },
      'Failed to connect album to collections'
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
      message: 'Failed to connect album to collections',
      cause: error,
    });
  }
};

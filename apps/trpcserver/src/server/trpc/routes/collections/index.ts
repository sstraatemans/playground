import z from 'zod';
import {
  allCollections,
  AllCollectionsSchema,
} from '../../../../db/collections/allCollections.js';
import { collectionCount } from '../../../../db/collections/collectionCount.js';
import { getCollectionAlbumsById } from '../../../../db/collections/getCollectionAlbumsById.js';
import { getCollectionById } from '../../../../db/collections/getCollectionById.js';
import { procedure, router } from '../../trpc.js';

export const collectionsRouter = router({
  count: procedure.query(async () => {
    return await collectionCount();
  }),
  all: procedure.input(AllCollectionsSchema).query(async ({ input }) => {
    return await allCollections(input);
  }),
  getCollectionById: procedure.input(z.string()).query(async ({ input }) => {
    return await getCollectionById(input);
  }),
  getCollectionAlbumsById: procedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getCollectionAlbumsById(input);
    }),
});

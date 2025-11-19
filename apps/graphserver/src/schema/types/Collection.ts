import { builder } from '../builder.js';
import { trpc } from '../client.js';
import type { Album } from './Album.js';
import { AlbumCollectionRef } from './AlbumCollection.js';

export interface Collection {
  id: string;
  name: string;
  startYear: string;
  endYear?: string;
  albums?: Album[];
}

export const CollectionRef = builder.objectRef<Collection>('Collection');
export const CollectionsRef = builder.objectRef<{
  data: (typeof CollectionRef.$inferType)[]; // Or whatever the inferred type for AlbumRef is
  totalCount: number;
}>('Collections');

builder.objectType(CollectionsRef, {
  name: 'Collections',
  description: 'Paginated collections with total count',
  fields: (t) => ({
    data: t.field({
      type: [CollectionRef],
      resolve: (root) => root.data,
    }),
    totalCount: t.field({
      type: 'Int',
      resolve: (root) => root.totalCount,
    }),
  }),
});

CollectionRef.implement({
  description: 'A Suske en Wiske albums collection',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    startYear: t.exposeString('startYear'),
    endYear: t.exposeString('endYear'),
    albums: t.field({
      type: [AlbumCollectionRef],
      resolve: async (collection) => {
        const data = await trpc.collections.getCollectionAlbumsById.query(
          collection.id
        );
        return data;
      },
    }),
  }),
});

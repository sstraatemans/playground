import { builder } from '../builder.js';
import { trpc } from '../client.js';
import { AlbumRef } from './Album.js';
import { CollectionRef } from './Collection.js';

export interface AlbumCollection {
  number: number;
  collectionId: string;
  albumId: number;
}

export const AlbumCollectionRef =
  builder.objectRef<AlbumCollection>('AlbumCollection');

AlbumCollectionRef.implement({
  description: 'An album series relation with number',
  fields: (t) => ({
    albumId: t.exposeInt('albumId'),
    album: t.field({
      type: AlbumRef,
      nullable: true,
      resolve: async (albumCollection) => {
        const data = await trpc.albums.getAlbumById.query(
          albumCollection.albumId
        );
        if (!data) return null;
        return {
          ...data,
          date: new Date(data.date),
        };
      },
    }),
    serieId: t.exposeID('collectionId'),
    serie: t.field({
      type: CollectionRef,
      nullable: true,
      resolve: async (albumSerie) => {
        const data = await trpc.collections.getCollectionById.query(
          albumSerie.collectionId
        );
        return data;
      },
    }),
    number: t.exposeInt('number'),
  }),
});

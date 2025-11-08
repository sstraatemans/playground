import { builder } from '../builder.js';
import { trpc } from '../client.js';
import { AlbumRef } from './Album.js';
import { SerieRef } from './Serie.js';

export interface AlbumSerie {
  number: number;
  serieId: string;
  albumId: number;
}

export const AlbumSerieRef = builder.objectRef<AlbumSerie>('AlbumSerie');

AlbumSerieRef.implement({
  description: 'An album series relation with number',
  fields: (t) => ({
    albumId: t.exposeInt('albumId'),
    album: t.field({
      type: AlbumRef,
      nullable: true,
      resolve: async (albumSerie) => {
        const data = await trpc.albums.getAlbumById.query(albumSerie.albumId);
        if (!data) return null;
        return {
          ...data,
          date: new Date(data.date),
        };
      },
    }),
    serieId: t.exposeID('serieId'),
    serie: t.field({
      type: SerieRef,
      nullable: true,
      resolve: async (albumSerie) => {
        const data = await trpc.series.getSerieById.query(albumSerie.serieId);
        return data;
      },
    }),
    number: t.exposeInt('number'),
  }),
});

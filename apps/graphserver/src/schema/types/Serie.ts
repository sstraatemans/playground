import { builder } from '../builder.js';
import { trpc } from '../client.js';
import type { Album } from './Album.js';
import { AlbumSerieRef } from './AlbumSerie.js';

export interface Serie {
  id: string;
  name: string;
  startYear: string;
  endYear?: string;
  albums?: Album[];
}

export const SerieRef = builder.objectRef<Serie>('Serie');
export const SeriesRef = builder.objectRef<{
  data: (typeof SerieRef.$inferType)[]; // Or whatever the inferred type for AlbumRef is
  totalCount: number;
}>('Series');

builder.objectType(SeriesRef, {
  name: 'Series',
  description: 'Paginated series with total count',
  fields: (t) => ({
    data: t.field({
      type: [SerieRef],
      resolve: (root) => root.data,
    }),
    totalCount: t.field({
      type: 'Int',
      resolve: (root) => root.totalCount,
    }),
  }),
});

SerieRef.implement({
  description: 'A Suske en Wiske albums series',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    startYear: t.exposeString('startYear'),
    endYear: t.exposeString('endYear'),
    albums: t.field({
      type: [AlbumSerieRef],
      resolve: async (serie) => {
        const data = await trpc.series.getSerieAlbumsById.query(serie.id);
        return data;
      },
    }),
  }),
});

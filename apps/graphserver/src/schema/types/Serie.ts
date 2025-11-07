import { builder } from '../builder';
import { trpc } from '../client';
import type { Album } from './Album';
// Adjust path if needed
import { AlbumSerieRef } from './AlbumSerie';

export interface Serie {
  id: string;
  name: string;
  startYear: string;
  endYear?: string;
  albums?: Album[];
}

export const SerieRef = builder.objectRef<Serie>('Serie');

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

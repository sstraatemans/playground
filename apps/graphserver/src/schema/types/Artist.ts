import { builder } from '../builder.js';
import { trpc } from '../client.js';
import { AlbumRef } from './Album.js';
import type { Album } from './Album.js';

export interface Artist {
  id: number;
  name: string;
  albums?: Album[];
}

export const ArtistRef = builder.objectRef<Artist>('Artist');
export const ArtistsRef = builder.objectRef<{
  data: (typeof ArtistRef.$inferType)[]; // Or whatever the inferred type for AlbumRef is
  totalCount: number;
}>('Artists');

builder.objectType(ArtistsRef, {
  name: 'Artists',
  description: 'Paginated artists with total count',
  fields: (t) => ({
    data: t.field({
      type: [ArtistRef],
      resolve: (root) => root.data,
    }),
    totalCount: t.field({
      type: 'Int',
      resolve: (root) => root.totalCount,
    }),
  }),
});

ArtistRef.implement({
  description: 'A Suske en Wiske artist for the series',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    albums: t.field({
      type: [AlbumRef],
      resolve: async (artist) => {
        const data = await trpc.artists.getArtistAlbumsById.query(artist.id);
        return data;
      },
    }),
  }),
});

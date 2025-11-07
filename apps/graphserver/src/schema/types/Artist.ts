import { builder } from '../builder';
import { trpc } from '../client';
import type { Album } from './Album';
import { AlbumRef } from './Album';

export interface Artist {
  id: number;
  name: string;
  albums?: Album[];
}

export const ArtistRef = builder.objectRef<Artist>('Artist');

ArtistRef.implement({
  description: 'A Suske en Wiske artist for the series',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    albums: t.field({
      type: [AlbumRef],
      resolve: async (artist) => {
        const data = await trpc.artists.getArtistAlbumsById.query(
          Number(artist.id)
        );

        return data;
      },
    }),
  }),
});

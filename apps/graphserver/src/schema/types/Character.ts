import { builder } from '../builder';
import { trpc } from '../client';
import type { Album } from './Album';
import { AlbumRef } from './Album';

export interface Character {
  id: number;
  name: string;
  description: string;
  albums?: Album[];
}

export const CharacterRef = builder.objectRef<Character>('Character');
export const CharactersRef = builder.objectRef<{
  data: (typeof CharacterRef.$inferType)[]; // Or whatever the inferred type for AlbumRef is
  totalCount: number;
}>('Characters');

builder.objectType(CharactersRef, {
  name: 'Characters',
  description: 'Paginated characters with total count',
  fields: (t) => ({
    data: t.field({
      type: [CharacterRef],
      resolve: (root) => root.data,
    }),
    totalCount: t.field({
      type: 'Int',
      resolve: (root) => root.totalCount,
    }),
  }),
});

CharacterRef.implement({
  description: 'A character from Suske en Wiske',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    albums: t.field({
      type: [AlbumRef],
      resolve: async (character) => {
        const data = await trpc.characters.getCharactersAlbumsById.query(
          Number(character.id)
        );
        return data.map((album) => ({
          ...album,
          date: new Date(album.date),
        }));
      },
    }),
  }),
});

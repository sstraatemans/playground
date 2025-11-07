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

import type { AppRouter } from '@playground/trpcserver';
import SchemaBuilder from '@pothos/core';
import { createTRPCProxyClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import { DateResolver } from 'graphql-scalars';
import superjson from 'superjson';
import type { Character } from './types/Character';

// Create tRPC client pointing to local server
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.TRPCSERVER ?? '', // Your server URL
      transformer: superjson,
    }),
  ],
});

export interface Album {
  id: number;
  number: number;
  title: string;
  date: Date;
}

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
}>({});

builder.addScalarType('Date', DateResolver, {});

const AlbumRef = builder.objectRef<Album>('Album');
const CharacterRef = builder.objectRef<Character>('Character');

AlbumRef.implement({
  description: 'A Suske en Wiske album',
  fields: (t) => ({
    id: t.exposeID('id'),
    number: t.exposeInt('number'),
    title: t.exposeString('title'),
    date: t.expose('date', { type: 'Date' }),
    characters: t.field({
      type: [CharacterRef],
      resolve: async (album) => {
        const data = await trpc.albums.getAlbumCharactersById.query(
          Number(album.id)
        );
        return data;
      },
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

builder.queryType({
  fields: (t) => ({
    albums: t.field({
      type: [AlbumRef],
      resolve: async () => {
        const data = await trpc.albums.all.query();
        return data.map((album) => ({
          ...album,
          date: new Date(album.date),
        }));
      },
    }),
    album: t.field({
      type: AlbumRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, { id }) => {
        const data = await trpc.albums.getAlbumById.query(Number(id));
        if (!data) return null;
        return {
          ...data,
          date: new Date(data.date),
        };
      },
    }),
    characters: t.field({
      type: [CharacterRef],
      resolve: async () => {
        const data = await trpc.characters.all.query();
        return data.map((character) => ({
          ...character,
        }));
      },
    }),
    character: t.field({
      type: CharacterRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, { id }) => {
        const data = await trpc.characters.getCharacterById.query(Number(id));
        return data;
      },
    }),
  }),
});

export const schema = builder.toSchema();

// src/schema/queries.ts
import { builder } from './builder';
import { trpc } from './client';
import { AlbumRef } from './types/Album';
import { ArtistRef } from './types/Artist';
import { CharacterRef } from './types/Character';
import { SerieRef } from './types/Serie';

builder.queryType({
  fields: (t) => ({
    artist: t.field({
      type: ArtistRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, { id }) => {
        const data = await trpc.artists.getArtistById.query(Number(id));
        return data;
      },
    }),
    artists: t.field({
      type: [ArtistRef],
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.artists.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });

        return data.artists;
      },
    }),
    artistCount: t.field({
      type: 'Int',
      resolve: async () => {
        return await trpc.artists.count.query();
      },
    }),
    series: t.field({
      type: [SerieRef],
      resolve: async () => {
        const data = await trpc.series.all.query();
        return data;
      },
    }),
    albums: t.field({
      type: [AlbumRef],
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.albums.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });

        return data.albums.map((album) => {
          const parsedDate = new Date(album.date);
          return {
            ...album,
            date: isNaN(parsedDate.getTime()) ? null : parsedDate,
          };
        });
      },
    }),
    albumCount: t.field({
      type: 'Int',
      resolve: async () => {
        return await trpc.albums.count.query();
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
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.characters.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });
        return data.characters;
      },
    }),
    characterCount: t.field({
      type: 'Int',
      resolve: async () => {
        return await trpc.characters.count.query();
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

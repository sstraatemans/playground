// src/schema/queries.ts
import { builder } from './builder.js';
import { trpc } from './client.js';
import { AlbumRef, AlbumsRef } from './types/Album.js';
import { ArtistRef, ArtistsRef } from './types/Artist.js';
import { CharacterRef, CharactersRef } from './types/Character.js';
import { SerieRef, SeriesRef } from './types/Serie.js';

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
      type: ArtistsRef,
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.artists.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });
        return {
          data: data.artists,
          totalCount: data.totalCount,
        };
      },
    }),
    serie: t.field({
      type: SerieRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, { id }) => {
        const data = await trpc.series.getSerieById.query(id);
        return data;
      },
    }),
    series: t.field({
      type: SeriesRef,
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.series.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });
        return {
          data: data.series,
          totalCount: data.totalCount,
        };
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
    albums: t.field({
      type: AlbumsRef,
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.albums.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });

        return {
          data: data.albums.map((album) => ({
            ...album,
            date: new Date(album.date),
          })),
          totalCount: data.totalCount,
        };
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
    characters: t.field({
      type: CharactersRef,
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
      },
      resolve: async (_, { offset, limit }) => {
        const data = await trpc.characters.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
        });
        return {
          data: data.characters,
          totalCount: data.totalCount,
        };
      },
    }),
  }),
});

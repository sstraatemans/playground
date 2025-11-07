import SchemaBuilder from '@pothos/core';
import type { AppRouter } from '@sw/s_w_trpcserver';
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import { DateResolver } from 'graphql-scalars';
import superjson from 'superjson';
import type { Album, AlbumSerie } from './types/Album';
import type { Artist } from './types/Artist';
import type { Character } from './types/Character';
import type { Serie } from './types/Serie';

// Create tRPC client pointing to local server
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.TRPCSERVER ?? '', // Your server URL
      transformer: superjson,
      maxURLLength: 4000,
      maxItems: 3,
    }),
  ],
});

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
}>({});

builder.addScalarType('Date', DateResolver, {});

const AlbumRef = builder.objectRef<Album>('Album');
const ArtistRef = builder.objectRef<Artist>('Artist');
const AlbumSerieRef = builder.objectRef<AlbumSerie>('AlbumSerie'); // series of an album with number
const CharacterRef = builder.objectRef<Character>('Character');
const SerieRef = builder.objectRef<Serie>('Serie');

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

AlbumRef.implement({
  description: 'A Suske en Wiske album',
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    date: t.field({
      type: 'Date',
      resolve: (album) => {
        const parsedDate = new Date(album.date ?? '');
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      },
    }),
    description: t.exposeString('description', { nullable: true }),
    scenarioArtist: t.field({
      type: ArtistRef,
      resolve: async (album) => {
        if (!album.scenarioArtistId) return;
        const data = await trpc.artists.getArtistById.query(
          album.scenarioArtistId
        );
        return data;
      },
    }),
    drawArtist: t.field({
      type: ArtistRef,
      resolve: async (album) => {
        if (!album.drawArtistId) return;
        const data = await trpc.artists.getArtistById.query(album.drawArtistId);
        return data;
      },
    }),
    characters: t.field({
      type: [CharacterRef],
      resolve: async (album) => {
        const data = await trpc.albums.getAlbumCharactersById.query(
          Number(album.id)
        );
        return data;
      },
    }),
    series: t.field({
      type: [AlbumSerieRef],
      resolve: async (album) => {
        const data = await trpc.albums.getAlbumSeriesById.query(
          Number(album.id)
        );

        return data.flat();
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

export const schema = builder.toSchema();

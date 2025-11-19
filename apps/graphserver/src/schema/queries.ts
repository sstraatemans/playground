// src/schema/queries.ts
import {
  AlbumOrderBySchema,
  AlbumOrderDirectionSchema,
} from '@sstraatemans/sw_trpcclient';
import { ArtistOrderBySchema } from '../../../trpcserver/src/db/artists/schemas.js';
import { CharacterOrderBySchema } from '../../../trpcserver/src/db/characters/schemas.js';
import { builder } from './builder.js';
import { trpc } from './client.js';
import { AlbumRef, AlbumsRef } from './types/Album.js';
import { ArtistRef, ArtistsRef } from './types/Artist.js';
import { CharacterRef, CharactersRef } from './types/Character.js';
import { CollectionRef, CollectionsRef } from './types/Collection.js';

const AlbumOrderByEnum = builder.enumType('AlbumOrderBy', {
  values: AlbumOrderBySchema.options,
});

const ArtistOrderByEnum = builder.enumType('ArtistOrderBy', {
  values: ArtistOrderBySchema.options,
});

const CharacterOrderByEnum = builder.enumType('CharacterOrderBy', {
  values: CharacterOrderBySchema.options,
});
const CollectionOrderByEnum = builder.enumType('CollectionOrderBy', {
  values: CharacterOrderBySchema.options,
});

const OrderDirectionEnum = builder.enumType('OrderDirection', {
  values: AlbumOrderDirectionSchema.options,
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
    artists: t.field({
      type: ArtistsRef,
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
        orderBy: t.arg({ type: ArtistOrderByEnum, defaultValue: 'id' }),
        orderDirection: t.arg({
          type: OrderDirectionEnum,
          defaultValue: 'asc',
        }),
      },
      resolve: async (_, { offset, limit, orderBy, orderDirection }) => {
        const { data, totalCount } = await trpc.artists.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
          orderBy: orderBy ?? undefined,
          orderDirection: orderDirection ?? undefined,
        });
        return {
          data,
          totalCount,
        };
      },
    }),
    collection: t.field({
      type: CollectionRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, { id }) => {
        const data = await trpc.collections.getCollectionById.query(id);
        return data;
      },
    }),
    collections: t.field({
      type: CollectionsRef,
      args: {
        offset: t.arg.int(),
        limit: t.arg.int(),
        orderBy: t.arg({ type: CollectionOrderByEnum, defaultValue: 'id' }),
        orderDirection: t.arg({
          type: OrderDirectionEnum,
          defaultValue: 'asc',
        }),
      },
      resolve: async (_, { offset, limit, orderBy, orderDirection }) => {
        const { data, totalCount } = await trpc.collections.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
          orderBy: orderBy ?? undefined,
          orderDirection: orderDirection ?? undefined,
        });
        return {
          data,
          totalCount,
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
        orderBy: t.arg({ type: AlbumOrderByEnum, defaultValue: 'id' }),
        orderDirection: t.arg({
          type: OrderDirectionEnum,
          defaultValue: 'asc',
        }),
      },
      resolve: async (_, { offset, limit, orderBy, orderDirection }) => {
        const { data, totalCount } = await trpc.albums.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
          orderBy: orderBy ?? undefined,
          orderDirection: orderDirection ?? undefined,
        });

        return {
          data: data.map((album) => ({
            ...album,
            date: new Date(album.date),
          })),
          totalCount,
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
        orderBy: t.arg({ type: CharacterOrderByEnum, defaultValue: 'id' }),
        orderDirection: t.arg({
          type: OrderDirectionEnum,
          defaultValue: 'asc',
        }),
      },
      resolve: async (_, { offset, limit, orderBy, orderDirection }) => {
        const { data, totalCount } = await trpc.characters.all.query({
          offset: offset ?? undefined,
          limit: limit ?? undefined,
          orderBy: orderBy ?? undefined,
          orderDirection: orderDirection ?? undefined,
        });
        return {
          data,
          totalCount,
        };
      },
    }),
  }),
});

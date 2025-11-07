import { builder } from '../builder';
import { trpc } from '../client';
import type { AlbumSerie } from './AlbumSerie';
import { AlbumSerieRef } from './AlbumSerie';
import type { Artist } from './Artist';
import { ArtistRef } from './Artist';
import type { Character } from './Character';
import { CharacterRef } from './Character';

export interface Album {
  id: number;
  wikiURL?: string | null;
  title: string;
  date: Date | string | null; // Can be Date object, ISO date string, or null for invalid dates
  characters?: Character[];
  series?: AlbumSerie[];
  description?: string | null;
  scenarioArtistId: number | null;
  drawArtistId: number | null;
  scenarioArtist?: Artist;
  drawArtist?: Artist;
}

export const AlbumRef = builder.objectRef<Album>('Album');
export const AlbumsRef = builder.objectRef<{
  data: (typeof AlbumRef.$inferType)[]; // Or whatever the inferred type for AlbumRef is
  totalCount: number;
}>('Albums');

builder.objectType(AlbumsRef, {
  name: 'Albums',
  description: 'Paginated albums with total count',
  fields: (t) => ({
    data: t.field({
      type: [AlbumRef],
      resolve: (root) => root.data,
    }),
    totalCount: t.field({
      type: 'Int',
      resolve: (root) => root.totalCount,
    }),
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

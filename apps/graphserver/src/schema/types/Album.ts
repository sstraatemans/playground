import type { Artist } from './Artist';
import type { Character } from './Character';

export interface AlbumSerie {
  number: number;
  serieId: string;
  albumId: number;
}
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

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
  date: Date | string; // Can be Date object or ISO date string
  characters?: Character[];
  series?: AlbumSerie[];
  description?: string | null;
  scenarioArtistId: number | null;
  drawArtistId: number | null;
  scenarioArtist?: Artist;
  drawArtist?: Artist;
}

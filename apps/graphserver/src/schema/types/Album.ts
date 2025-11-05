import type { Character } from './Character';

export interface AlbumSerie {
  number: number;
  serieId: string;
  albumId: number;
}
export interface Album {
  id: number;
  title: string;
  date: Date; // ISO date string, e.g., 'YYYY-MM-DD'
  characters?: Character[];
  series?: AlbumSerie[];
}

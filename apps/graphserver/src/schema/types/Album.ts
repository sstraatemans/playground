import type { Character } from './Character';

export interface Album {
  id: number;
  number: number;
  title: string;
  date: string; // ISO date string, e.g., 'YYYY-MM-DD'
  characters?: Character[];
}

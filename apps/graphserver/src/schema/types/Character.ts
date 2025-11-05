import type { Album } from './Album';

export interface Character {
  id: number;
  name: string;
  description: string;
  albums?: Album[];
}

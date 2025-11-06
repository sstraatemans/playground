import type { Album } from './Album';

export interface Artist {
  id: number;
  name: string;
  albums?: Album[];
}

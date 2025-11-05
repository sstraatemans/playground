import type { Album } from '..';

export interface Character {
  id: number;
  name: string;
  description: string;
  albums?: Album[];
}

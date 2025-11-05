import type { Album } from '..';

export interface Serie {
  id: string;
  name: string;
  startYear: string;
  endYear?: string;
  albums?: Album[];
}

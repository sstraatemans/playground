import type { Album } from './Album';

export interface Serie {
  id: string;
  name: string;
  startYear: string;
  endYear?: string;
  albums?: Album[];
}

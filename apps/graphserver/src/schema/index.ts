import { builder } from './builder';
import './queries';
import './types/Album';
import './types/AlbumSerie';
import './types/Artist';
import './types/Character';
import './types/Serie';

export const schema = builder.toSchema();

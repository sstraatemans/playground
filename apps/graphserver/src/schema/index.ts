// src/schema/index.ts
import './builder';
import { builder } from './builder';
import './queries';
// Initializes builder and scalars
import './types/Album';
import './types/AlbumSerie';
import './types/Artist';
import './types/Character';
import './types/Serie';

export const schema = builder.toSchema();

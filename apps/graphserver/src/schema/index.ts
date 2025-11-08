import { builder } from './builder.js';
import './queries.js';
import './types/Album.js';
import './types/AlbumSeriev';
import './types/Artist.js';
import './types/Character.js';
import './types/Serie.js';

export const schema = builder.toSchema();

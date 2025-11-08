import { builder } from './builder.js';
import './queries.js';
import './types/Album.js';
import './types/AlbumCollection.js';
import './types/Artist.js';
import './types/Character.js';
import './types/Collection.js';

export const schema = builder.toSchema();

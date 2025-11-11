/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import * as z from 'zod';
// File: TransactionIsolationLevel.schema.ts

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable'])

export type TransactionIsolationLevel = z.infer<typeof TransactionIsolationLevelSchema>;

// File: CollectionScalarFieldEnum.schema.ts

export const CollectionScalarFieldEnumSchema = z.enum(['id', 'name', 'startYear', 'endYear', 'wikiURL'])

export type CollectionScalarFieldEnum = z.infer<typeof CollectionScalarFieldEnumSchema>;

// File: AlbumScalarFieldEnum.schema.ts

export const AlbumScalarFieldEnumSchema = z.enum(['id', 'title', 'date', 'scenarioArtistId', 'drawArtistId', 'wikiURL', 'description', 'image'])

export type AlbumScalarFieldEnum = z.infer<typeof AlbumScalarFieldEnumSchema>;

// File: ArtistScalarFieldEnum.schema.ts

export const ArtistScalarFieldEnumSchema = z.enum(['id', 'name', 'wikiURL', 'image'])

export type ArtistScalarFieldEnum = z.infer<typeof ArtistScalarFieldEnumSchema>;

// File: CharacterScalarFieldEnum.schema.ts

export const CharacterScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'years', 'albumsTemp', 'wikiURL'])

export type CharacterScalarFieldEnum = z.infer<typeof CharacterScalarFieldEnumSchema>;

// File: AlbumCharacterScalarFieldEnum.schema.ts

export const AlbumCharacterScalarFieldEnumSchema = z.enum(['albumId', 'characterId'])

export type AlbumCharacterScalarFieldEnum = z.infer<typeof AlbumCharacterScalarFieldEnumSchema>;

// File: CollectionAlbumScalarFieldEnum.schema.ts

export const CollectionAlbumScalarFieldEnumSchema = z.enum(['albumId', 'collectionId', 'number', 'image'])

export type CollectionAlbumScalarFieldEnum = z.infer<typeof CollectionAlbumScalarFieldEnumSchema>;

// File: SortOrder.schema.ts

export const SortOrderSchema = z.enum(['asc', 'desc'])

export type SortOrder = z.infer<typeof SortOrderSchema>;

// File: QueryMode.schema.ts

export const QueryModeSchema = z.enum(['default', 'insensitive'])

export type QueryMode = z.infer<typeof QueryModeSchema>;

// File: NullsOrder.schema.ts

export const NullsOrderSchema = z.enum(['first', 'last'])

export type NullsOrder = z.infer<typeof NullsOrderSchema>;

// File: Collection.schema.ts

export const CollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  startYear: z.string(),
  endYear: z.string(),
  wikiURL: z.string().nullish(),
});

export type CollectionType = z.infer<typeof CollectionSchema>;


// File: Album.schema.ts

export const AlbumSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  date: z.string(),
  scenarioArtistId: z.number().int().nullish(),
  drawArtistId: z.number().int().nullish(),
  wikiURL: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
});

export type AlbumType = z.infer<typeof AlbumSchema>;


// File: Artist.schema.ts

export const ArtistSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  wikiURL: z.string().nullish(),
  image: z.string().nullish(),
});

export type ArtistType = z.infer<typeof ArtistSchema>;


// File: Character.schema.ts

export const CharacterSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  years: z.string(),
  albumsTemp: z.string(),
  wikiURL: z.string().nullish(),
});

export type CharacterType = z.infer<typeof CharacterSchema>;


// File: AlbumCharacter.schema.ts

export const AlbumCharacterSchema = z.object({
  albumId: z.number().int(),
  characterId: z.number().int(),
});

export type AlbumCharacterType = z.infer<typeof AlbumCharacterSchema>;


// File: CollectionAlbum.schema.ts

export const CollectionAlbumSchema = z.object({
  albumId: z.number().int(),
  collectionId: z.string(),
  number: z.number().int(),
  image: z.string().nullish(),
});

export type CollectionAlbumType = z.infer<typeof CollectionAlbumSchema>;


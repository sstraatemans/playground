# API Reference

Complete documentation for all available tRPC procedures in the @sw/trpcclient package.

---

## Table of Contents

- [Overview](#overview)
- [Albums](#albums)
  - [albums.count](#albumscount)
  - [albums.all](#albumsall)
  - [albums.getAlbumById](#albumsgetalbumbyid)
  - [albums.getAlbumCharactersById](#albumsgetalbumcharactersbyid)
  - [albums.getAlbumCollectionsById](#albumsgetalbumcollectionsbyid)
- [Characters](#characters)
  - [characters.count](#characterscount)
  - [characters.all](#charactersall)
  - [characters.getCharacterById](#charactersgetcharacterbyid)
  - [characters.getCharactersAlbumsById](#charactersgetcharactersalbumsbyid)
- [Artists](#artists)
  - [artists.count](#artistscount)
  - [artists.all](#artistsall)
  - [artists.getArtistById](#artistsgetartistbyid)
  - [artists.getArtistAlbumsById](#artistsgetartistalbumsbyid)
- [Collections](#collections)
  - [collections.count](#collectionscount)
  - [collections.all](#collectionsall)
  - [collections.getCollectionById](#collectionsgetcollectionbyid)
  - [collections.getCollectionAlbumsById](#collectionsgetcollectionalbumsbyid)
- [Pagination](#pagination)
- [Error Handling](#error-handling)

---

## Overview

All procedures return type-safe results with full TypeScript support. The API is organized into four main routers:

- **albums** - Query Suske en Wiske comic albums
- **characters** - Query characters that appear in the comics
- **artists** - Query artists (writers and illustrators)
- **collections** - Query album collections/series

---

## Albums

### `albums.count`

Get the total number of albums in the database.

**Type:** Query  
**Authentication:** None required

#### Input

No input parameters required.

```typescript
// Zod Schema
z.void();
```

#### Output

```typescript
// Return Type
number;
```

#### Example

```typescript
import { createClient } from '@sw/trpcclient';

const trpc = createClient({ url: 'http://localhost:4000/trpc/v1' });

const count = await trpc.albums.count.query();
console.log(`Total albums: ${count}`);
// Output: Total albums: 378
```

---

### `albums.all`

Get a paginated list of all albums with their details.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
}).optional();

// TypeScript Type
interface AllAlbumsInput {
  offset?: number; // Default: 0
  limit?: number; // Default: 50, Max: 50
}
```

#### Output

```typescript
// Return Type
interface AllAlbumsOutput {
  totalCount: number;
  data: Album[];
}

// Album Type
interface Album {
  id: number;
  title: string;
  date: string;
  scenarioArtistId: number | null;
  drawArtistId: number | null;
  wikiURL: string | null;
  description: string | null;
  image: string | null;
}
```

#### Example Request

```typescript
const albums = await trpc.albums.all.query({
  offset: 0,
  limit: 10,
});

console.log(`Found ${albums.totalCount} total albums`);
console.log(`First album: ${albums.data[0].title}`);
```

#### Example Response

```json
{
  "totalCount": 378,
  "data": [
    {
      "id": 1,
      "title": "Rikki en Wiske in Chocowakije",
      "date": "1945",
      "scenarioArtistId": 1,
      "drawArtistId": 1,
      "wikiURL": "https://nl.wikipedia.org/wiki/Rikki_en_Wiske_in_Chocowakije",
      "description": "Het eerste album in de reeks...",
      "image": "/images/album-1.jpg"
    }
  ]
}
```

#### Error Codes

- `INTERNAL_SERVER_ERROR` - Unexpected database error
- `SERVICE_UNAVAILABLE` - Database connection unavailable

---

### `albums.getAlbumById`

Get detailed information about a specific album by its ID.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();

// TypeScript Type
number;
```

#### Output

```typescript
// Album Type (same as above)
Album | null;
```

#### Example

```typescript
const album = await trpc.albums.getAlbumById.query(1);

if (album) {
  console.log(`Title: ${album.title}`);
  console.log(`Released: ${album.date}`);
}
```

---

### `albums.getAlbumCharactersById`

Get all characters that appear in a specific album.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();
```

#### Output

```typescript
// Return Type
Character[]

interface Character {
  id: number;
  name: string;
  description: string;
  years: string;
  albumsTemp: string;
  wikiURL: string | null;
}
```

#### Example

```typescript
const characters = await trpc.albums.getAlbumCharactersById.query(1);

console.log(`Characters in album: ${characters.length}`);
characters.forEach((char) => {
  console.log(`- ${char.name}`);
});
```

---

### `albums.getAlbumCollectionsById`

Get all collections/series that include a specific album.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();
```

#### Output

```typescript
// Return Type
CollectionAlbum[]

interface CollectionAlbum {
  albumId: number;
  collectionId: string;
  number: number;
  image: string | null;
  collection: Collection;
}

interface Collection {
  id: string;
  name: string;
  startYear: string;
  endYear: string;
  wikiURL: string | null;
}
```

#### Example

```typescript
const collections = await trpc.albums.getAlbumCollectionsById.query(1);

collections.forEach((item) => {
  console.log(`${item.collection.name} #${item.number}`);
});
```

---

## Characters

### `characters.count`

Get the total number of characters in the database.

**Type:** Query  
**Authentication:** None required

#### Input

No input parameters required.

#### Output

```typescript
number;
```

#### Example

```typescript
const count = await trpc.characters.count.query();
console.log(`Total characters: ${count}`);
```

---

### `characters.all`

Get a paginated list of all characters.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
}).optional();

// TypeScript Type
interface AllCharactersInput {
  offset?: number; // Default: 0
  limit?: number; // Default: 50, Max: 50
}
```

#### Output

```typescript
interface AllCharactersOutput {
  totalCount: number;
  data: Character[];
}
```

#### Example

```typescript
const characters = await trpc.characters.all.query({
  offset: 0,
  limit: 20,
});

console.log(`Total characters: ${characters.totalCount}`);
```

---

### `characters.getCharacterById`

Get detailed information about a specific character.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();
```

#### Output

```typescript
Character | null;
```

#### Example

```typescript
const character = await trpc.characters.getCharacterById.query(1);

if (character) {
  console.log(`Name: ${character.name}`);
  console.log(`Description: ${character.description}`);
}
```

---

### `characters.getCharactersAlbumsById`

Get all albums featuring a specific character.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();
```

#### Output

```typescript
Album[]
```

#### Example

```typescript
const albums = await trpc.characters.getCharactersAlbumsById.query(1);

console.log(`Albums featuring this character: ${albums.length}`);
albums.forEach((album) => {
  console.log(`- ${album.title} (${album.date})`);
});
```

---

## Artists

### `artists.count`

Get the total number of artists in the database.

**Type:** Query  
**Authentication:** None required

#### Input

No input parameters required.

#### Output

```typescript
number;
```

#### Example

```typescript
const count = await trpc.artists.count.query();
console.log(`Total artists: ${count}`);
```

---

### `artists.all`

Get a paginated list of all artists (writers and illustrators).

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
}).optional();

// TypeScript Type
interface AllArtistsInput {
  offset?: number; // Default: 0
  limit?: number; // Default: 50, Max: 50
}
```

#### Output

```typescript
interface AllArtistsOutput {
  totalCount: number;
  data: Artist[];
}

interface Artist {
  id: number;
  name: string;
  wikiURL: string | null;
  image: string | null;
}
```

#### Example

```typescript
const artists = await trpc.artists.all.query({
  offset: 0,
  limit: 10,
});

console.log(`Total artists: ${artists.totalCount}`);
```

---

### `artists.getArtistById`

Get detailed information about a specific artist.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();
```

#### Output

```typescript
Artist | null;
```

#### Example

```typescript
const artist = await trpc.artists.getArtistById.query(1);

if (artist) {
  console.log(`Name: ${artist.name}`);
  console.log(`Wikipedia: ${artist.wikiURL}`);
}
```

---

### `artists.getArtistAlbumsById`

Get all albums created by a specific artist (as writer or illustrator).

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.number();
```

#### Output

```typescript
Album[]
```

#### Example

```typescript
const albums = await trpc.artists.getArtistAlbumsById.query(1);

console.log(`Albums by this artist: ${albums.length}`);
albums.forEach((album) => {
  console.log(`- ${album.title}`);
});
```

---

## Collections

### `collections.count`

Get the total number of collections/series in the database.

**Type:** Query  
**Authentication:** None required

#### Input

No input parameters required.

#### Output

```typescript
number;
```

#### Example

```typescript
const count = await trpc.collections.count.query();
console.log(`Total collections: ${count}`);
```

---

### `collections.all`

Get a paginated list of all collections/series.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
}).optional();

// TypeScript Type
interface AllCollectionsInput {
  offset?: number; // Default: 0
  limit?: number; // Default: 50, Max: 50
}
```

#### Output

```typescript
interface AllCollectionsOutput {
  totalCount: number;
  data: Collection[];
}

interface Collection {
  id: string;
  name: string;
  startYear: string;
  endYear: string;
  wikiURL: string | null;
}
```

#### Example

```typescript
const collections = await trpc.collections.all.query({
  offset: 0,
  limit: 10,
});

console.log(`Total collections: ${collections.totalCount}`);
```

---

### `collections.getCollectionById`

Get detailed information about a specific collection.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.string();
```

#### Output

```typescript
Collection | null;
```

#### Example

```typescript
const collection =
  await trpc.collections.getCollectionById.query('blauwe-reeks');

if (collection) {
  console.log(`Name: ${collection.name}`);
  console.log(`Years: ${collection.startYear} - ${collection.endYear}`);
}
```

---

### `collections.getCollectionAlbumsById`

Get all albums in a specific collection/series.

**Type:** Query  
**Authentication:** None required

#### Input

```typescript
// Zod Schema
z.string();
```

#### Output

```typescript
CollectionAlbum[]

interface CollectionAlbum {
  albumId: number;
  collectionId: string;
  number: number;
  image: string | null;
  album: Album;
}
```

#### Example

```typescript
const albums =
  await trpc.collections.getCollectionAlbumsById.query('blauwe-reeks');

console.log(`Albums in collection: ${albums.length}`);
albums.forEach((item) => {
  console.log(`#${item.number}: ${item.album.title}`);
});
```

---

## Pagination

All list endpoints (`albums.all`, `characters.all`, `artists.all`, `collections.all`) support pagination with the following parameters:

### Parameters

- **offset** (optional): Number of records to skip. Default: `0`
  - Negative values are treated as `0`
  - Used for "page-based" pagination

- **limit** (optional): Maximum number of records to return. Default: `50`, Max: `50`
  - Values less than 1 are set to `50`
  - Values greater than 50 are clamped to `50`

### Pagination Example

```typescript
// Get page 1 (first 20 items)
const page1 = await trpc.albums.all.query({
  offset: 0,
  limit: 20,
});

// Get page 2 (next 20 items)
const page2 = await trpc.albums.all.query({
  offset: 20,
  limit: 20,
});

// Get page 3 (next 20 items)
const page3 = await trpc.albums.all.query({
  offset: 40,
  limit: 20,
});

// Calculate total pages
const totalPages = Math.ceil(page1.totalCount / 20);
console.log(`Total pages: ${totalPages}`);
```

### Implementing Infinite Scroll

```typescript
let offset = 0;
const limit = 20;
let hasMore = true;
const allAlbums: Album[] = [];

while (hasMore) {
  const result = await trpc.albums.all.query({ offset, limit });
  allAlbums.push(...result.data);

  offset += limit;
  hasMore = offset < result.totalCount;
}

console.log(`Loaded all ${allAlbums.length} albums`);
```

---

## Error Handling

All queries may throw tRPC errors. Common error codes:

### `INTERNAL_SERVER_ERROR`

Unexpected server or database error.

```typescript
try {
  const albums = await trpc.albums.all.query();
} catch (error) {
  if (error.data?.code === 'INTERNAL_SERVER_ERROR') {
    console.error('Server error:', error.message);
  }
}
```

### `SERVICE_UNAVAILABLE`

Database connection is temporarily unavailable.

```typescript
try {
  const count = await trpc.albums.count.query();
} catch (error) {
  if (error.data?.code === 'SERVICE_UNAVAILABLE') {
    console.error('Database unavailable. Please try again later.');
  }
}
```

### Complete Error Handling Example

```typescript
import type { AppRouter } from '@sw/trpcclient';
import { TRPCClientError } from '@trpc/client';

try {
  const albums = await trpc.albums.all.query({ offset: 0, limit: 10 });
  console.log(albums);
} catch (error) {
  if (error instanceof TRPCClientError<AppRouter>) {
    // Handle known tRPC errors
    switch (error.data?.code) {
      case 'SERVICE_UNAVAILABLE':
        console.error('Service temporarily unavailable');
        break;
      case 'INTERNAL_SERVER_ERROR':
        console.error('Internal server error:', error.message);
        break;
      default:
        console.error('Unexpected error:', error);
    }
  } else {
    // Handle network or other errors
    console.error('Network error:', error);
  }
}
```

---

**[← Back to Main README](../README.md)**

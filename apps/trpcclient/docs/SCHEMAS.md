# Zod Schemas & TypeScript Types

Complete reference for all Zod validation schemas and TypeScript types available in @straatemans/sw_trpcclient.

---

## Table of Contents

- [Usage](#usage)
- [Core Schemas](#core-schemas)
  - [Album](#album)
  - [Artist](#artist)
  - [Character](#character)
  - [Collection](#collection)
  - [CollectionAlbum](#collectionalbum)
  - [AlbumCharacter](#albumcharacter)
- [Input Schemas](#input-schemas)
  - [AllAlbumsSchema](#allalbumsschema)
  - [AllCharactersSchema](#allcharactersschema)
  - [AllArtistsSchema](#allartistsschema)
  - [AllCollectionsSchema](#allcollectionsschema)
- [Enum Schemas](#enum-schemas)
  - [SortOrder](#sortorder)
  - [ScalarFieldEnums](#scalarfieldenums)
- [Using Schemas](#using-schemas)

---

## Usage

Import schemas and types from the package:

```typescript
// Import specific schemas
import {
  AlbumSchema,
  CharacterSchema,
  ArtistSchema,
  type AlbumType,
  type CharacterType
} from "@straatemans/sw_trpcclient";

// Or import from schemas subpath
import { AlbumSchema } from "@straatemans/sw_trpcclient/schemas";
```

---

## Core Schemas

### Album

Schema for Suske en Wiske comic albums.

#### Zod Schema

```typescript
import { z } from 'zod';

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
```

#### TypeScript Type

```typescript
export type AlbumType = z.infer<typeof AlbumSchema>;

// Equivalent to:
interface Album {
  id: number;
  title: string;
  date: string;
  scenarioArtistId: number | null | undefined;
  drawArtistId: number | null | undefined;
  wikiURL: string | null | undefined;
  description: string | null | undefined;
  image: string | null | undefined;
}
```

#### Fields

- **id** - Unique album identifier
- **title** - Album title (in Dutch)
- **date** - Publication date/year
- **scenarioArtistId** - ID of the scenario writer (nullable)
- **drawArtistId** - ID of the illustrator (nullable)
- **wikiURL** - Wikipedia URL (nullable)
- **description** - Album description (nullable)
- **image** - Album cover image URL (nullable)

#### Example Usage

```typescript
import { AlbumSchema, type AlbumType } from '@straatemans/sw_trpcclient';

// Validate data
const album = AlbumSchema.parse({
  id: 1,
  title: 'Rikki en Wiske in Chocowakije',
  date: '1945',
  scenarioArtistId: 1,
  drawArtistId: 1,
  wikiURL: 'https://nl.wikipedia.org/wiki/...',
  description: 'Het eerste album...',
  image: '/images/album-1.jpg',
});

// Use as type
const myAlbum: AlbumType = {
  id: 1,
  title: 'Test Album',
  date: '2024',
  scenarioArtistId: null,
  drawArtistId: null,
  wikiURL: null,
  description: null,
  image: null,
};
```

---

### Artist

Schema for comic artists (writers and illustrators).

#### Zod Schema

```typescript
export const ArtistSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  wikiURL: z.string().nullish(),
  image: z.string().nullish(),
});
```

#### TypeScript Type

```typescript
export type ArtistType = z.infer<typeof ArtistSchema>;

// Equivalent to:
interface Artist {
  id: number;
  name: string;
  wikiURL: string | null | undefined;
  image: string | null | undefined;
}
```

#### Fields

- **id** - Unique artist identifier
- **name** - Artist's name
- **wikiURL** - Wikipedia URL (nullable)
- **image** - Artist photo URL (nullable)

#### Example Usage

```typescript
import { ArtistSchema, type ArtistType } from '@straatemans/sw_trpcclient';

const artist: ArtistType = {
  id: 1,
  name: 'Willy Vandersteen',
  wikiURL: 'https://nl.wikipedia.org/wiki/Willy_Vandersteen',
  image: '/images/willy-vandersteen.jpg',
};

// Validate
ArtistSchema.parse(artist); // ✓ Valid
```

---

### Character

Schema for characters appearing in the comics.

#### Zod Schema

```typescript
export const CharacterSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  years: z.string(),
  albumsTemp: z.string(),
  wikiURL: z.string().nullish(),
});
```

#### TypeScript Type

```typescript
export type CharacterType = z.infer<typeof CharacterSchema>;

// Equivalent to:
interface Character {
  id: number;
  name: string;
  description: string;
  years: string;
  albumsTemp: string;
  wikiURL: string | null | undefined;
}
```

#### Fields

- **id** - Unique character identifier
- **name** - Character's name
- **description** - Character description (in Dutch)
- **years** - Years the character appeared
- **albumsTemp** - Temporary album list (legacy field)
- **wikiURL** - Wikipedia URL (nullable)

#### Example Usage

```typescript
import {
  CharacterSchema,
  type CharacterType,
} from '@straatemans/sw_trpcclient';

const character: CharacterType = {
  id: 1,
  name: 'Suske',
  description: 'Hoofdpersonage uit de stripreeks',
  years: '1945-present',
  albumsTemp: '1,2,3,4...',
  wikiURL: 'https://nl.wikipedia.org/wiki/Suske',
};
```

---

### Collection

Schema for album collections/series.

#### Zod Schema

```typescript
export const CollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  startYear: z.string(),
  endYear: z.string(),
  wikiURL: z.string().nullish(),
});
```

#### TypeScript Type

```typescript
export type CollectionType = z.infer<typeof CollectionSchema>;

// Equivalent to:
interface Collection {
  id: string;
  name: string;
  startYear: string;
  endYear: string;
  wikiURL: string | null | undefined;
}
```

#### Fields

- **id** - Unique collection identifier (string slug)
- **name** - Collection/series name
- **startYear** - Year the collection started
- **endYear** - Year the collection ended
- **wikiURL** - Wikipedia URL (nullable)

#### Example Usage

```typescript
import {
  CollectionSchema,
  type CollectionType,
} from '@straatemans/sw_trpcclient';

const collection: CollectionType = {
  id: 'blauwe-reeks',
  name: 'Blauwe reeks',
  startYear: '1946',
  endYear: '2023',
  wikiURL: 'https://nl.wikipedia.org/wiki/Blauwe_reeks',
};
```

---

### CollectionAlbum

Schema for the junction table between collections and albums.

#### Zod Schema

```typescript
export const CollectionAlbumSchema = z.object({
  albumId: z.number().int(),
  collectionId: z.string(),
  number: z.number().int(),
  image: z.string().nullish(),
});
```

#### TypeScript Type

```typescript
export type CollectionAlbumType = z.infer<typeof CollectionAlbumSchema>;

// Equivalent to:
interface CollectionAlbum {
  albumId: number;
  collectionId: string;
  number: number;
  image: string | null | undefined;
}
```

#### Fields

- **albumId** - ID of the album
- **collectionId** - ID of the collection
- **number** - Album number within the collection
- **image** - Collection-specific cover image (nullable)

---

### AlbumCharacter

Schema for the junction table between albums and characters.

#### Zod Schema

```typescript
export const AlbumCharacterSchema = z.object({
  albumId: z.number().int(),
  characterId: z.number().int(),
});
```

#### TypeScript Type

```typescript
export type AlbumCharacterType = z.infer<typeof AlbumCharacterSchema>;

// Equivalent to:
interface AlbumCharacter {
  albumId: number;
  characterId: number;
}
```

---

## Input Schemas

### AllAlbumsSchema

Input schema for paginated album queries.

#### Zod Schema

```typescript
export const AllAlbumsSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();
```

#### TypeScript Type

```typescript
type AllAlbumsInput =
  | {
      offset?: number;
      limit?: number;
    }
  | undefined;
```

#### Usage

```typescript
import { AllAlbumsSchema } from '@straatemans/sw_trpcclient';

// Valid inputs
AllAlbumsSchema.parse({ offset: 0, limit: 10 }); // ✓
AllAlbumsSchema.parse({ offset: 20 }); // ✓
AllAlbumsSchema.parse({ limit: 50 }); // ✓
AllAlbumsSchema.parse({}); // ✓
AllAlbumsSchema.parse(undefined); // ✓
```

---

### AllCharactersSchema

Input schema for paginated character queries.

#### Zod Schema

```typescript
export const AllCharactersSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();
```

Same structure as `AllAlbumsSchema`.

---

### AllArtistsSchema

Input schema for paginated artist queries.

#### Zod Schema

```typescript
export const AllArtistsSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();
```

Same structure as `AllAlbumsSchema`.

---

### AllCollectionsSchema

Input schema for paginated collection queries.

#### Zod Schema

```typescript
export const AllCollectionsSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();
```

Same structure as `AllAlbumsSchema`.

---

## Enum Schemas

### SortOrder

Schema for sort order direction.

```typescript
export const SortOrderSchema = z.enum(['asc', 'desc']);
export type SortOrder = z.infer<typeof SortOrderSchema>;
// 'asc' | 'desc'
```

---

### ScalarFieldEnums

Field enumerations for each model type.

#### AlbumScalarFieldEnum

```typescript
export const AlbumScalarFieldEnumSchema = z.enum([
  'id',
  'title',
  'date',
  'scenarioArtistId',
  'drawArtistId',
  'wikiURL',
  'description',
  'image',
]);

export type AlbumScalarFieldEnum = z.infer<typeof AlbumScalarFieldEnumSchema>;
```

#### ArtistScalarFieldEnum

```typescript
export const ArtistScalarFieldEnumSchema = z.enum([
  'id',
  'name',
  'wikiURL',
  'image',
]);

export type ArtistScalarFieldEnum = z.infer<typeof ArtistScalarFieldEnumSchema>;
```

#### CharacterScalarFieldEnum

```typescript
export const CharacterScalarFieldEnumSchema = z.enum([
  'id',
  'name',
  'description',
  'years',
  'albumsTemp',
  'wikiURL',
]);

export type CharacterScalarFieldEnum = z.infer<
  typeof CharacterScalarFieldEnumSchema
>;
```

#### CollectionScalarFieldEnum

```typescript
export const CollectionScalarFieldEnumSchema = z.enum([
  'id',
  'name',
  'startYear',
  'endYear',
  'wikiURL',
]);

export type CollectionScalarFieldEnum = z.infer<
  typeof CollectionScalarFieldEnumSchema
>;
```

---

## Using Schemas

### Validation

Use schemas to validate runtime data:

```typescript
import { AlbumSchema, CharacterSchema } from '@straatemans/sw_trpcclient';

// Validate and parse
const album = AlbumSchema.parse(unknownData);

// Safe parse (doesn't throw)
const result = AlbumSchema.safeParse(unknownData);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Type Guards

Create type guard functions:

```typescript
import { AlbumSchema, type AlbumType } from '@straatemans/sw_trpcclient';

function isAlbum(data: unknown): data is AlbumType {
  return AlbumSchema.safeParse(data).success;
}

// Usage
if (isAlbum(someData)) {
  // TypeScript knows someData is AlbumType
  console.log(someData.title);
}
```

### Form Validation

Use with form libraries like React Hook Form:

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlbumSchema, type AlbumType } from "@straatemans/sw_trpcclient";

function AlbumForm() {
  const { register, handleSubmit } = useForm<AlbumType>({
    resolver: zodResolver(AlbumSchema),
  });

  const onSubmit = (data: AlbumType) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      <input {...register("date")} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Partial Schemas

Create partial versions for updates:

```typescript
import { AlbumSchema } from '@straatemans/sw_trpcclient';

// Create a partial schema (all fields optional)
const PartialAlbumSchema = AlbumSchema.partial();

// Or make specific fields required
const UpdateAlbumSchema = AlbumSchema.partial().extend({
  id: z.number().int(), // ID is required for updates
});

type UpdateAlbumInput = z.infer<typeof UpdateAlbumSchema>;
```

### Extending Schemas

Add custom fields to existing schemas:

```typescript
import { AlbumSchema } from '@straatemans/sw_trpcclient';

const AlbumWithMetadataSchema = AlbumSchema.extend({
  viewCount: z.number().int().default(0),
  isFavorite: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

type AlbumWithMetadata = z.infer<typeof AlbumWithMetadataSchema>;
```

### Picking Fields

Create schemas with only specific fields:

```typescript
import { AlbumSchema } from '@straatemans/sw_trpcclient';

// Only id and title
const AlbumSummarySchema = AlbumSchema.pick({
  id: true,
  title: true,
  date: true,
});

type AlbumSummary = z.infer<typeof AlbumSummarySchema>;
// { id: number; title: string; date: string; }
```

### Omitting Fields

Create schemas without specific fields:

```typescript
import { AlbumSchema } from '@straatemans/sw_trpcclient';

// Everything except image
const AlbumWithoutImageSchema = AlbumSchema.omit({
  image: true,
});

type AlbumWithoutImage = z.infer<typeof AlbumWithoutImageSchema>;
```

---

## Type Inference Examples

### Infer Types from API Responses

```typescript
import { createClient } from '@straatemans/sw_trpcclient';

const trpc = createClient({
  url: 'https://playground-trpcserver.vercel.app/trpc/v1',
});

// Get inferred types from procedures
type AlbumsAllResponse = Awaited<ReturnType<typeof trpc.albums.all.query>>;
// { totalCount: number; data: Album[] }

type Album = AlbumsAllResponse['data'][number];
// { id: number; title: string; ... }
```

### Use with React State

```typescript
import { useState } from 'react';
import type { AlbumType, CharacterType } from '@straatemans/sw_trpcclient';

function useAlbums() {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumType | null>(null);

  // Type-safe state management
  return { albums, setAlbums, selectedAlbum, setSelectedAlbum };
}
```

### Array Utilities

```typescript
import type { AlbumType } from '@straatemans/sw_trpcclient';

// Filter albums by year
function filterByYear(albums: AlbumType[], year: string): AlbumType[] {
  return albums.filter((album) => album.date.includes(year));
}

// Sort albums by title
function sortByTitle(albums: AlbumType[]): AlbumType[] {
  return [...albums].sort((a, b) => a.title.localeCompare(b.title));
}
```

---

**[← Back to Main README](../README.md)** | **[API Reference →](./API_REFERENCE.md)**

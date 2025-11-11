# Next.js App Router Integration

Complete guide for using @straatemans/sw_trpcclient with Next.js 13+ App Router, including Server Components, Client Components, and React Query integration.

---

## Table of Contents

- [Installation](#installation)
- [Project Setup](#project-setup)
- [Server Components](#server-components)
- [Client Components](#client-components)
- [React Query Integration](#react-query-integration)
- [Server Actions](#server-actions)
- [Caching Strategies](#caching-strategies)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Complete Example](#complete-example)

---

## Installation

First, install the required dependencies:

```bash
pnpm add @straatemans/sw_trpcclient superjson zod
pnpm add -D @trpc/react-query @tanstack/react-query
```

---

## Project Setup

### 1. Environment Variables

Create a `.env.local` file in your Next.js project root:

```bash
# .env.local
NEXT_PUBLIC_TRPC_SERVER_URL=https://playground-trpcserver.vercel.app/trpc/v1
```

### 2. Create tRPC Client

Create a client utility file:

**`src/utils/trpc-client.ts`**

```typescript
import { createClient } from '@straatemans/sw_trpcclient';

export const trpcClient = createClient({
  url: process.env.NEXT_PUBLIC_TRPC_SERVER_URL!,
});

// Export type for use in components
export type TrpcClient = typeof trpcClient;
```

---

## Server Components

Server Components can directly use the tRPC client without React Query.

### Basic Server Component

**`app/albums/page.tsx`**

```typescript
import { trpcClient } from "@/utils/trpc-client";

export default async function AlbumsPage() {
  // Direct query in Server Component
  const albums = await trpcClient.albums.all.query({
    offset: 0,
    limit: 20,
  });

  return (
    <div>
      <h1>Albums ({albums.totalCount})</h1>
      <div className="grid gap-4">
        {albums.data.map((album) => (
          <div key={album.id} className="border p-4 rounded">
            <h2>{album.title}</h2>
            <p>Released: {album.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dynamic Server Component

**`app/albums/[id]/page.tsx`**

```typescript
import { trpcClient } from "@/utils/trpc-client";
import { notFound } from "next/navigation";
import type { AlbumType } from "@straatemans/sw_trpcclient";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const albumId = parseInt(params.id);

  if (isNaN(albumId)) {
    notFound();
  }

  const album = await trpcClient.albums.getAlbumById.query(albumId);

  if (!album) {
    notFound();
  }

  const characters = await trpcClient.albums.getAlbumCharactersById.query(albumId);

  return (
    <div>
      <h1>{album.title}</h1>
      <p>Released: {album.date}</p>

      {album.description && (
        <p className="mt-4">{album.description}</p>
      )}

      <h2 className="mt-8">Characters</h2>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Parallel Data Fetching

Fetch multiple queries in parallel:

```typescript
import { trpcClient } from "@/utils/trpc-client";

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [albums, characters, artists, collections] = await Promise.all([
    trpcClient.albums.count.query(),
    trpcClient.characters.count.query(),
    trpcClient.artists.count.query(),
    trpcClient.collections.count.query(),
  ]);

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Albums" count={albums} />
      <StatCard title="Characters" count={characters} />
      <StatCard title="Artists" count={artists} />
      <StatCard title="Collections" count={collections} />
    </div>
  );
}

function StatCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="border p-4 rounded">
      <h3>{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}
```

---

## Client Components

For interactive features, use Client Components with React Query.

### 1. Setup React Query Provider

**`app/providers.tsx`**

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**`app/layout.tsx`**

```typescript
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2. Create React Query Hooks

**`src/hooks/use-albums.ts`**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/utils/trpc-client';

export function useAlbums(offset = 0, limit = 20) {
  return useQuery({
    queryKey: ['albums', 'all', { offset, limit }],
    queryFn: () => trpcClient.albums.all.query({ offset, limit }),
  });
}

export function useAlbum(id: number) {
  return useQuery({
    queryKey: ['albums', 'byId', id],
    queryFn: () => trpcClient.albums.getAlbumById.query(id),
    enabled: id > 0,
  });
}

export function useAlbumCharacters(albumId: number) {
  return useQuery({
    queryKey: ['albums', albumId, 'characters'],
    queryFn: () => trpcClient.albums.getAlbumCharactersById.query(albumId),
    enabled: albumId > 0,
  });
}
```

### 3. Use Hooks in Client Components

**`components/albums-list.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useAlbums } from "@/hooks/use-albums";

export function AlbumsList() {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const offset = page * pageSize;

  const { data, isLoading, isError, error } = useAlbums(offset, pageSize);

  if (isLoading) {
    return <div>Loading albums...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  const totalPages = Math.ceil(data.totalCount / pageSize);

  return (
    <div>
      <h2>Albums ({data.totalCount})</h2>

      <div className="grid gap-4">
        {data.data.map((album) => (
          <div key={album.id} className="border p-4 rounded">
            <h3>{album.title}</h3>
            <p>Released: {album.date}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## React Query Integration

### Custom Query Hooks Pattern

Create a centralized hooks file for all queries:

**`src/hooks/use-trpc.ts`**

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/utils/trpc-client';

// Albums
export const useTrpc = {
  // Albums
  albums: {
    count: () =>
      useQuery({
        queryKey: ['albums', 'count'],
        queryFn: () => trpcClient.albums.count.query(),
      }),
    all: (offset = 0, limit = 20) =>
      useQuery({
        queryKey: ['albums', 'all', { offset, limit }],
        queryFn: () => trpcClient.albums.all.query({ offset, limit }),
      }),
    byId: (id: number) =>
      useQuery({
        queryKey: ['albums', 'byId', id],
        queryFn: () => trpcClient.albums.getAlbumById.query(id),
        enabled: id > 0,
      }),
    characters: (albumId: number) =>
      useQuery({
        queryKey: ['albums', albumId, 'characters'],
        queryFn: () => trpcClient.albums.getAlbumCharactersById.query(albumId),
        enabled: albumId > 0,
      }),
  },

  // Characters
  characters: {
    count: () =>
      useQuery({
        queryKey: ['characters', 'count'],
        queryFn: () => trpcClient.characters.count.query(),
      }),
    all: (offset = 0, limit = 20) =>
      useQuery({
        queryKey: ['characters', 'all', { offset, limit }],
        queryFn: () => trpcClient.characters.all.query({ offset, limit }),
      }),
    byId: (id: number) =>
      useQuery({
        queryKey: ['characters', 'byId', id],
        queryFn: () => trpcClient.characters.getCharacterById.query(id),
        enabled: id > 0,
      }),
  },

  // Artists
  artists: {
    count: () =>
      useQuery({
        queryKey: ['artists', 'count'],
        queryFn: () => trpcClient.artists.count.query(),
      }),
    all: (offset = 0, limit = 20) =>
      useQuery({
        queryKey: ['artists', 'all', { offset, limit }],
        queryFn: () => trpcClient.artists.all.query({ offset, limit }),
      }),
    byId: (id: number) =>
      useQuery({
        queryKey: ['artists', 'byId', id],
        queryFn: () => trpcClient.artists.getArtistById.query(id),
        enabled: id > 0,
      }),
  },

  // Collections
  collections: {
    count: () =>
      useQuery({
        queryKey: ['collections', 'count'],
        queryFn: () => trpcClient.collections.count.query(),
      }),
    all: (offset = 0, limit = 20) =>
      useQuery({
        queryKey: ['collections', 'all', { offset, limit }],
        queryFn: () => trpcClient.collections.all.query({ offset, limit }),
      }),
    byId: (id: string) =>
      useQuery({
        queryKey: ['collections', 'byId', id],
        queryFn: () => trpcClient.collections.getCollectionById.query(id),
        enabled: Boolean(id),
      }),
  },
};
```

**Usage:**

```typescript
"use client";

import { useTrpc } from "@/hooks/use-trpc";

export function MyComponent() {
  const { data: albumCount } = useTrpc.albums.count();
  const { data: albums } = useTrpc.albums.all(0, 10);

  return <div>Total: {albumCount}</div>;
}
```

---

## Server Actions

Use tRPC client in Next.js Server Actions:

**`app/actions/albums.ts`**

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { trpcClient } from '@/utils/trpc-client';

export async function getAlbumDetails(albumId: number) {
  try {
    const album = await trpcClient.albums.getAlbumById.query(albumId);
    return { success: true, data: album };
  } catch (error) {
    return { success: false, error: 'Failed to fetch album' };
  }
}

export async function prefetchAlbums() {
  // Prefetch data for the page
  const albums = await trpcClient.albums.all.query({ offset: 0, limit: 20 });

  // Optionally revalidate
  revalidatePath('/albums');

  return albums;
}
```

---

## Caching Strategies

### Static Generation (SSG)

Generate static pages at build time:

**`app/albums/[id]/page.tsx`**

```typescript
import { trpcClient } from "@/utils/trpc-client";

// Generate static params at build time
export async function generateStaticParams() {
  const albums = await trpcClient.albums.all.query({ offset: 0, limit: 100 });

  return albums.data.map((album) => ({
    id: album.id.toString(),
  }));
}

// Revalidate every hour
export const revalidate = 3600;

export default async function AlbumPage({
  params,
}: {
  params: { id: string };
}) {
  const album = await trpcClient.albums.getAlbumById.query(
    parseInt(params.id)
  );

  return <div>{album?.title}</div>;
}
```

### Incremental Static Regeneration (ISR)

```typescript
// Revalidate every 10 minutes
export const revalidate = 600;

export default async function AlbumsPage() {
  const albums = await trpcClient.albums.all.query({ offset: 0, limit: 20 });
  return <div>{/* render albums */}</div>;
}
```

### Dynamic Rendering

Force dynamic rendering:

```typescript
// Force dynamic
export const dynamic = "force-dynamic";

export default async function AlbumsPage() {
  const albums = await trpcClient.albums.all.query({ offset: 0, limit: 20 });
  return <div>{/* render albums */}</div>;
}
```

---

## Error Handling

### Server Component Error Handling

**`app/albums/error.tsx`**

```typescript
"use client";

export default function AlbumsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Client Component Error Handling

```typescript
"use client";

import { useTrpc } from "@/hooks/use-trpc";
import { TRPCClientError } from "@trpc/client";

export function AlbumsList() {
  const { data, error, isError } = useTrpc.albums.all(0, 20);

  if (isError) {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "SERVICE_UNAVAILABLE") {
        return <div>Service temporarily unavailable. Please try again.</div>;
      }
      return <div>Error: {error.message}</div>;
    }
    return <div>An unexpected error occurred</div>;
  }

  return <div>{/* render albums */}</div>;
}
```

---

## Best Practices

### 1. Separate Server and Client Code

```
src/
  utils/
    trpc-client.ts      # Server & Client
  hooks/
    use-trpc.ts         # Client only
  components/
    albums-list.tsx     # "use client"
  app/
    albums/
      page.tsx          # Server Component
```

### 2. Use Suspense Boundaries

```typescript
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlbumsList />
    </Suspense>
  );
}
```

### 3. Prefetch on Hover

```typescript
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc-client";
import Link from "next/link";

export function AlbumLink({ id, title }: { id: number; title: string }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["albums", "byId", id],
      queryFn: () => trpcClient.albums.getAlbumById.query(id),
    });
  };

  return (
    <Link href={`/albums/${id}`} onMouseEnter={prefetch}>
      {title}
    </Link>
  );
}
```

---

## Complete Example

Here's a complete example with all patterns:

**`app/albums/page.tsx`** (Server Component)

```typescript
import { trpcClient } from "@/utils/trpc-client";
import { AlbumsClient } from "./albums-client";

export default async function AlbumsPage() {
  // Initial server-side data fetch
  const initialData = await trpcClient.albums.all.query({
    offset: 0,
    limit: 20,
  });

  return (
    <div>
      <h1>Suske en Wiske Albums</h1>
      <AlbumsClient initialData={initialData} />
    </div>
  );
}
```

**`app/albums/albums-client.tsx`** (Client Component)

```typescript
"use client";

import { useState } from "react";
import { useAlbums } from "@/hooks/use-albums";
import type { AlbumType } from "@straatemans/sw_trpcclient";
import Link from "next/link";

interface Props {
  initialData: {
    totalCount: number;
    data: AlbumType[];
  };
}

export function AlbumsClient({ initialData }: Props) {
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data = initialData, isLoading } = useAlbums(
    page * pageSize,
    pageSize
  );

  const totalPages = Math.ceil(data.totalCount / pageSize);

  return (
    <div>
      <div className="grid gap-4">
        {data.data.map((album) => (
          <Link
            key={album.id}
            href={`/albums/${album.id}`}
            className="border p-4 rounded hover:bg-gray-50"
          >
            <h2 className="font-bold">{album.title}</h2>
            <p className="text-gray-600">Released: {album.date}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0 || isLoading}
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1 || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

**[← Back to Main README](../README.md)** | **[API Reference →](./API_REFERENCE.md)** | **[Schemas →](./SCHEMAS.md)**

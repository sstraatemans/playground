# @sstraatemans/sw_trpcclient

> Type-safe client library for accessing Suske en Wiske (Spike and Suzy) comic data

A fully type-safe tRPC client package that provides auto-generated hooks and utilities for querying Suske en Wiske albums, characters, artists, and collections. Built on top of [@trpc/client](https://trpc.io/docs/client) with full TypeScript support and Zod schema validation.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Client Setup](#client-setup)
  - [Basic Usage](#basic-usage)
  - [With Custom Headers](#with-custom-headers)
  - [Configuration Options](#configuration-options)
- [Documentation](#documentation)
- [Features](#features)

---

## Installation

### npm

```bash
npm install @sstraatemans/sw_trpcclient
```

### yarn

```bash
yarn add @sstraatemans/sw_trpcclient
```

### pnpm

```bash
pnpm add @sstraatemans/sw_trpcclient
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install superjson zod
```

Or with pnpm:

```bash
pnpm add superjson zod
```

---

## Quick Start

Get started in just a few lines of code:

```typescript
import { createClient } from '@sstraatemans/sw_trpcclient';

// 1. Create the client
const trpc = createClient({
  url: 'https://playground-trpcserver.vercel.app/trpc/v1',
});

// 2. Make type-safe queries
const albums = await trpc.albums.all.query({ offset: 0, limit: 10 });
console.log(`Found ${albums.totalCount} albums`);

// 3. Get a specific album by ID
const album = await trpc.albums.getAlbumById.query(1);
console.log(`Album: ${album.title}`);
```

---

## Client Setup

### Basic Usage

The simplest way to set up the client:

```typescript
import { createClient } from '@sstraatemans/sw_trpcclient';

export const trpcClient = createClient({
  url: 'https://playground-trpcserver.vercel.app/trpc/v1',
});
```

### With Custom Headers

Add authentication or custom headers:

```typescript
import { createClient } from '@sstraatemans/sw_trpcclient';

export const trpcClient = createClient({
  url: 'https://playground-trpcserver.vercel.app/trpc/v1',
  headers: {
    'x-api-key': process.env.API_KEY,
    'x-client-version': '1.0.0',
  },
});
```

Or use a function for dynamic headers:

```typescript
export const trpcClient = createClient({
  url: 'https://playground-trpcserver.vercel.app/trpc/v1',
  headers: async () => {
    const token = await getAuthToken();
    return {
      authorization: `Bearer ${token}`,
    };
  },
});
```

### Configuration Options

```typescript
interface CreateClientOptions {
  // Server URL (required)
  url: string;

  // Custom transformer (default: superjson)
  transformer?: typeof superjson;

  // HTTP headers for requests
  headers?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);

  // Maximum URL length for batching (default: 4000)
  maxURLLength?: number;

  // Maximum batch items (default: 3)
  maxItems?: number;
}
```

**Example with all options:**

```typescript
import { createClient } from '@sstraatemans/sw_trpcclient';
import superjson from 'superjson';

export const trpcClient = createClient({
  url: 'https://playground-trpcserver.vercel.app/trpc/v1',
  transformer: superjson,
  headers: {
    'x-client-name': 'my-app',
  },
  maxURLLength: 5000,
  maxItems: 5,
});
```

---

## Documentation

- **[API Reference](./docs/API_REFERENCE.md)** - Complete endpoint documentation with examples
- **[Zod Schemas](./docs/SCHEMAS.md)** - All TypeScript types and Zod validation schemas
- **[Next.js App Router Guide](./docs/APP_ROUTER.md)** - Integration with Next.js 13+ App Router
- **[Online Documentation](https://suskeenwiske.dev)** - Full documentation, examples, and interactive API explorer

---

## Alternative APIs

Don't want to use tRPC? No problem! The Suske en Wiske data is also available through other APIs:

### GraphQL API

Access the data using GraphQL for flexible queries and precise data fetching.

```graphql
query {
  albums(limit: 10) {
    id
    title
    year
  }
}
```

**GraphQL Endpoint:** `https://graphql.suskeenwiske.dev/v1`

### REST API

Use traditional REST endpoints for simple HTTP requests.

```bash
curl https://suskeenwiske.dev/api/v1/albums
```

**REST Base URL:** `https://suskeenwiske.dev/api/v1`

For more information about the GraphQL and REST APIs, visit the [online documentation](https://suskeenwiske.dev).

---

## Features

✨ **Fully Type-Safe** - Auto-generated TypeScript types from the tRPC server  
🔒 **Zod Validation** - Runtime type checking with Zod schemas  
📦 **Tree-Shakeable** - Only import what you need  
🚀 **HTTP Batching** - Automatic request batching for better performance  
🎯 **IntelliSense** - Full autocomplete support in your IDE  
🌐 **SuperJSON** - Native support for Date, Map, Set, BigInt, and more

---

## License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## Support

[![GitHub issues](https://img.shields.io/github/issues/sstraatemans/playground.svg?style=flat-square)](https://github.com/sstraatemans/playground/issues)
[![Open new issue](https://img.shields.io/badge/Open_Issue-Submit-blue.svg?style=flat-square)](https://github.com/sstraatemans/playground/issues/new/choose)

Having an issue, question, or want to contribute?

1. **Check existing issues** → [Issues page](https://github.com/sstraatemans/playground/issues)
2. **Not found?** [Open a new issue](https://github.com/sstraatemans/playground/issues/new/choose)

---

**Happy coding! 🎉**

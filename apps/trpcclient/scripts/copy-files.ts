#!/usr/bin/env tsx
import { copyFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const trpcserverRoot = join(projectRoot, '..', 'trpcserver');

// Only copy what's actually needed - schemas and client utilities
const filesToCopy: Array<{ from: string; to: string }> = [
  { from: 'src/generated/zod/schemas.ts', to: 'src/generated/zod/schemas.ts' },
  { from: 'src/db/albums/schemas.ts', to: 'src/db/albums/schemas.ts' },
];

console.log('📦 Copying files from trpcserver...');

filesToCopy.forEach(({ from, to }) => {
  const sourcePath = join(trpcserverRoot, from);
  const destPath = join(projectRoot, to);

  if (!existsSync(sourcePath)) {
    console.warn(`⚠️  Warning: Source file not found: ${from}`);
    return;
  }

  // Create destination directory if it doesn't exist
  const destDir = dirname(destPath);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  copyFileSync(sourcePath, destPath);
  console.log(`✓ Copied ${from}`);
});

// Create client utilities (modified from trpcserver to not depend on router internals)
const clientDir = join(projectRoot, 'src', 'client');
if (!existsSync(clientDir)) {
  mkdirSync(clientDir, { recursive: true });
}

const clientContent = `// src/client/index.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { CreateTRPCClient } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import superjson from 'superjson';

export interface CreateClientOptions {
  url: string;
  transformer?: any;
  headers?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);
  maxURLLength?: number;
  maxItems?: number;
}

/**
 * Create a typed tRPC client for any AppRouter
 * @param options - Configuration options for the client
 * @returns Typed tRPC client
 */
export function createClient<TRouter extends AnyRouter>(
  options: CreateClientOptions
): CreateTRPCClient<TRouter> {
  return createTRPCClient<TRouter>({
    links: [
      httpBatchLink({
        url: options.url,
        transformer: options.transformer ?? superjson,
        headers: options.headers,
        maxURLLength: options.maxURLLength ?? 4000,
        maxItems: options.maxItems ?? 1,
      } as any),
    ],
  });
}

// Re-export types from @trpc/client for convenience
export type { CreateTRPCClient as TRPCClient } from '@trpc/client';
`;

writeFileSync(join(clientDir, 'index.ts'), clientContent);
console.log('✓ Created client/index.ts');
console.log('✅ File copy complete!');

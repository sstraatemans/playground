// src/client/index.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../server/trpc/index.js';

export type { AppRouter };

export interface CreateClientOptions {
  url: string;
  transformer?: typeof superjson;
  headers?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);
  maxURLLength?: number;
  maxItems?: number;
}

/**
 * Create a typed tRPC client for the AppRouter
 * @param options - Configuration options for the client
 * @returns Typed tRPC client
 */
export function createClient(options: CreateClientOptions) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: options.url,
        transformer: options.transformer ?? superjson,
        headers: options.headers,
        maxURLLength: options.maxURLLength ?? 4000,
        maxItems: options.maxItems ?? 1,
      }),
    ],
  });
}

// Export AppRouter type
export type { AppRouter } from './src/server/trpc/index.js';

// Export all Zod schemas and types
export * from './src/generated/zod/schemas.js';
export * from './src/db/albums/schemas.js';

// Export client creation utilities and pre-configured client
export { createClient, type CreateClientOptions } from './src/client/index.js';

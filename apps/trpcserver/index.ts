// Export AppRouter type
export type { AppRouter } from './server/trpc/index.js';

// Export all Zod schemas and types
export * from './generated/zod/schemas.js';

// Export client creation utilities and pre-configured client
export { createClient, type CreateClientOptions } from './client/index.js';

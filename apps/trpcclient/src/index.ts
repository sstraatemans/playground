// Export client creation utilities
export {
  createClient,
  type CreateClientOptions,
  type TRPCClient,
} from './client/index.js';

// Export all Zod schemas and types
export * from './generated/zod/schemas.js';
export * from './db/albums/schemas.js';

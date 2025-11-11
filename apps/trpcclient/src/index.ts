// Export AppRouter type
export type { AppRouter } from '@straatemans/sw_trpcserver';

// Export all Zod schemas and types
export * from '@straatemans/sw_trpcserver/schemas';

// Export client creation utilities and pre-configured client
export {
  createClient,
  type CreateClientOptions,
} from '@straatemans/sw_trpcserver';

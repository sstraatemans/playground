// Export AppRouter type
export type { AppRouter } from '@sstraatemans/sw_trpcserver';

// Export all Zod schemas and types
export * from '@sstraatemans/sw_trpcserver/schemas';

// Export client creation utilities and pre-configured client
export {
  createClient,
  type CreateClientOptions,
} from '@sstraatemans/sw_trpcserver';

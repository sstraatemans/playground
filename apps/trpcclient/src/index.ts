// Export AppRouter type
export type { AppRouter } from '@sw/trpcserver';

// Export all Zod schemas and types
export * from '@sw/trpcserver/schemas';

// Export client creation utilities and pre-configured client
export { createClient, type CreateClientOptions } from '@sw/trpcserver';

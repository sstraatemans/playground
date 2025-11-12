import { createClient } from '@sstraatemans/sw_trpcserver';

export const trpc = createClient({
  url: process.env.TRPCSERVER!,
});

import { createClient } from '@sstraatemans/sw_trpcclient';

export const trpc = createClient({
  url: process.env.TRPCSERVER!,
});

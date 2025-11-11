import { createClient } from '@sstraatemans/sw_trpcserver';

export const trpc = createClient({
  url: process.env.NEXT_PUBLIC_TRPC_SERVER_URL!,
});

import { createClient } from '@sw/trpcserver';

export const trpc = createClient({
  url: process.env.NEXT_PUBLIC_TRPC_SERVER_URL!,
});

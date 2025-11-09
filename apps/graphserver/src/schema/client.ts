import { createClient } from '@sw/s_w_trpcserver';

export const trpc = createClient({
  url: process.env.NEXT_PUBLIC_TRPC_SERVER_URL!,
});

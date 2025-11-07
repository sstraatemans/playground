import type { AppRouter } from '@sw/s_w_trpcserver';
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.TRPCSERVER ?? '', // Your server URL
      transformer: superjson,
      maxURLLength: 4000,
      maxItems: 3,
    }),
  ],
});

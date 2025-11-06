import type { AppRouter } from '@playground/trpcserver';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.TRPCSERVER ?? '', // Your server URL
      transformer: superjson,
      maxURLLength: 4000,
      maxItems: 3,
    }),
  ],
});

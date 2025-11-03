import type { AppRouter } from '@playground/trpcserver';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

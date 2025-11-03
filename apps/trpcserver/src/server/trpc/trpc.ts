// src/server/trpc/trpc.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import { Context } from './context.js';

export const t = initTRPC.context<Context>().create({
  transformer: superjson, // <-- enables Date, BigInt, etc.
  errorFormatter({ shape }) {
    return shape;
  },
});

/** Helper types */
export type Router = typeof router;
export type Procedure = typeof procedure;
export const router = t.router;
export const procedure = t.procedure;

// src/server/trpc/trpc.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
export const t = initTRPC.context().create({
    transformer: superjson, // <-- enables Date, BigInt, etc.
    errorFormatter({ shape }) {
        return shape;
    },
});
export const router = t.router;
export const procedure = t.procedure;

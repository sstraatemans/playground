// src/server/trpc/trpc.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
export const t = initTRPC.context().create({
    transformer: superjson, // <-- enables Date, BigInt, etc.
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
/** Helper types */
export const router = t.router;
export const procedure = t.procedure;

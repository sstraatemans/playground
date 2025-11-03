import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import type { FastifyReply, FastifyRequest } from 'fastify';
declare module 'fastify' {
    interface FastifyRequest {
        cookies: {
            [cookieName: string]: string | undefined;
        };
    }
}
export type Context = {
    req: FastifyRequest;
    reply: FastifyReply;
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};
export declare function createContext(opts: {
    req: FastifyRequest;
    res: FastifyReply;
}): Context;
//# sourceMappingURL=context.d.ts.map
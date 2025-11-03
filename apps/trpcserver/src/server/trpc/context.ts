import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../db/client.js';

// 🔧 AUGMENT FastifyRequest for req.cookies (TypeScript-safe)
declare module 'fastify' {
  interface FastifyRequest {
    cookies: { [cookieName: string]: string | undefined };
  }
}

export type Context = {
  req: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};

export function createContext(opts: {
  req: FastifyRequest;
  res: FastifyReply;
}): Context {
  const { req, res: reply } = opts;

  return { req, reply, prisma };
}

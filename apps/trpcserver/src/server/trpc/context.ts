import type { FastifyReply, FastifyRequest } from 'fastify';

// 🔧 AUGMENT FastifyRequest for req.cookies (TypeScript-safe)
declare module 'fastify' {
  interface FastifyRequest {
    cookies: { [cookieName: string]: string | undefined };
  }
}

export type Context = {
  req: FastifyRequest;
  reply: FastifyReply;
};

export function createContext(opts: {
  req: FastifyRequest;
  res: FastifyReply;
}): Context {
  const { req, res: reply } = opts;

  return { req, reply };
}

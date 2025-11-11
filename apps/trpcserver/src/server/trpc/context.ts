import type { PrismaClient } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../db/client.js';

export type Context = {
  req: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaClient;
};

export function createContext(opts: {
  req: FastifyRequest;
  res: FastifyReply;
}): Context {
  const { req, res: reply } = opts;

  return { req, reply, prisma };
}

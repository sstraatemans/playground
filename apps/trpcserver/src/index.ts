import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { updateAlbumHandler } from 'server/update/index.js';
import type { AlbumParams } from 'server/update/index.js';
import { secretHandler } from 'server/utils/secretHandler.js';
import { createContext } from './server/trpc/context.js';
import { appRouter } from './server/trpc/index.js';

const app: Fastify.FastifyInstance = Fastify({
  logger: true,
});

async function main() {
  await app.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      // TODO: make something nice
      if (!origin) return callback(null, true);

      const allowedOrigins = ['http://localhost:3000'];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }: any) {
        app.log.error(`tRPC Error on ${path}:`, error);
      },
    },
  });

  await app.get<{ Params: AlbumParams }>(
    '/update',
    {
      preHandler: secretHandler,
    },
    updateAlbumHandler
  );

  await app.get<{ Params: AlbumParams }>(
    '/update/:albumId',
    {
      preHandler: secretHandler,
    },
    updateAlbumHandler
  );

  // 3️⃣ Start server
  await app.listen({ port: 4000, host: '0.0.0.0' });
  console.log('🚀 tRPC + Fastify ready on http://localhost:4000/trpc');
}

main().catch((err) => {
  console.error(err);
});

export type { AppRouter } from './server/trpc/index.js';

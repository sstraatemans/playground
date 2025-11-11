import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { createContext } from '../trpc/context.js';
import { appRouter } from '../trpc/index.js';

const app = Fastify({
  logger: true,
});

async function main() {
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

  // Start server
  await app.listen({ port: 4000, host: '0.0.0.0' });
  console.log(
    '🚀 tRPC + Fastify ready on https://playground-trpcserver.vercel.app/trpc/v1'
  );
}

main().catch((err) => {
  console.error(err);
});

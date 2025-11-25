import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { createContext } from './server/trpc/context.js';
import { appRouter } from './server/trpc/index.js';

const app: Fastify.FastifyInstance = Fastify({
  logger: true,
});

async function main() {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc/v1',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }: any) {
        app.log.error(`tRPC Error on ${path}:`, error);
      },
      // responseMeta(opts: any) {
      //   const { paths, errors, type } = opts;
      //   // Apply caching only for public queries with no errors
      //   const allPublic = paths?.every((path: string) =>
      //     path.includes('public')
      //   );
      //   const allOk = errors.length === 0;
      //   const isQuery = type === 'query';

      //   if (allPublic && allOk && isQuery) {
      //     const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      //     return {
      //       headers: {
      //         'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      //       },
      //     };
      //   }
      //   return {};
      // },
    },
  });

  // 3️⃣ Start server
  await app.listen({ port: 4000, host: '0.0.0.0' });
  console.log(
    '🚀 tRPC + Fastify ready on https://playground-trpcserver.vercel.app/trpc/v1'
  );
}

main().catch((err) => {
  console.error(err);
});

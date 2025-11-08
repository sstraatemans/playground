import { useDepthLimit } from '@envelop/depth-limit';
import { useSentry } from '@envelop/sentry';
import { useHive } from '@graphql-hive/envelop';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache';
import * as Sentry from '@sentry/node';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { schema } from './schema/index';

// Initialize Sentry (get DSN from sentry.io after free signup)
Sentry.init({
  dsn: (process.env.SENTRYDSN ?? '') as any,
  tracesSampleRate: 1.0, // Adjust for production sampling
  environment: process.env.ENV || 'development',
});

export const yoga = createYoga({
  schema,
  graphiql: true, // UI at http://localhost:4000
  graphqlEndpoint: '/v1',
  plugins: [
    useDepthLimit({
      maxDepth: 3, // Set this to your desired limit (e.g., 5-10; test based on your schema complexity)
      ignore: [], // Optional: Array of field names to ignore in depth calculation
    }),
    useHive({
      enabled: true,
      token: process.env.HYVETOKEN ?? '', // Get from app.graphql-hive.com after free signup
      usage: {
        target: process.env.HYVETARGET ?? '',
      },
    }),
    useSentry(),
    useResponseCache({
      session: () => null,
      ttl: process.env.ENV === 'production' ? 1000 * 60 * 60 * 24 : 1000, // Global 2s TTL
      invalidateViaMutation: true,
    }),
  ],
});

const server = createServer(yoga);

const port = process.env.PORT ?? 4001;
server.listen(port, () => {
  console.log(`GraphQL server ready at http://localhost:${port}/v1`);
});

import { useDepthLimit } from '@envelop/depth-limit';
import { useHive } from '@graphql-hive/envelop';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { schema } from './schema/index.js';

export const yoga = createYoga({
  schema,
  graphiql: true, // UI at http://localhost:4000
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
  ],
});

const server = createServer(yoga);

const port = process.env.PORT ?? 4001;
server.listen(port, () => {
  console.log(`GraphQL server ready at http://localhost:${port}/graphql`);
});

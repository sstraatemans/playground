import { useDepthLimit } from '@envelop/depth-limit';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { schema } from './schema';

const yoga = createYoga({
  schema,
  graphiql: true, // UI at http://localhost:4000
  plugins: [
    useDepthLimit({
      maxDepth: 3, // Set this to your desired limit (e.g., 5-10; test based on your schema complexity)
      ignore: [], // Optional: Array of field names to ignore in depth calculation
    }),
  ],
});

const server = createServer(yoga);

const port = process.env.PORT ?? 4001;
server.listen(port, () => {
  console.log(`GraphQL server ready at http://localhost:${port}/graphql`);
});

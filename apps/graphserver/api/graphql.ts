import { useDepthLimit } from '@envelop/depth-limit';
import { createYoga } from 'graphql-yoga';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { schema } from '@/schema/index.js';

// Create the Yoga instance
const yoga = createYoga({
  schema,
  graphiql: true, // UI at http://localhost:4000
  plugins: [
    useDepthLimit({
      maxDepth: 3, // Set this to your desired limit (e.g., 5-10; test based on your schema complexity)
      ignore: [], // Optional: Array of field names to ignore in depth calculation
    }),
  ],
  graphqlEndpoint: '/graphql',
});

// Export the handler for Vercel (handles Node.js req/res)
export default async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  return yoga.handle(req, res);
};

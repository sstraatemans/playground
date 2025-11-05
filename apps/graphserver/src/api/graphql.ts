import { createYoga } from 'graphql-yoga';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { yoga as yogaServer } from '@/server';

// Create the Yoga instance
const yoga = createYoga({
  ...yogaServer,
  graphqlEndpoint: '/', // This makes it handle requests at the root of the function (no extra path needed)
  // Add any other options like plugins, context, etc.
});

// Export the handler for Vercel (handles Node.js req/res)
export default async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  return yoga.handle(req, res);
};

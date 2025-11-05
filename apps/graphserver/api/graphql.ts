import { createYoga } from 'graphql-yoga';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { yoga as yogaServer } from '../src/server';

// Create the Yoga instance
const yoga = createYoga({
  ...yogaServer,
  graphqlEndpoint: '/',
});

// Export the handler for Vercel (handles Node.js req/res)
export default async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  return yoga.handle(req, res);
};

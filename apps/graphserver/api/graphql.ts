import type { IncomingMessage, ServerResponse } from 'node:http';
import { yoga } from '@/server.js';

// Export the handler for Vercel (handles Node.js req/res)
export default async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  return yoga.handle(req, res);
};

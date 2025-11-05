import type Fastify from 'fastify';

export const secretHandler = async (
  request: Fastify.FastifyRequest,
  reply: Fastify.FastifyReply
) => {
  // Simple auth check (replace with real auth in production)
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== process.env.SUPERSECRETKEY) {
    reply.status(401).send({ error: 'Unauthorized' });
    return;
  }
};

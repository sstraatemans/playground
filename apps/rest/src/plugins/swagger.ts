import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export async function setupSwagger(app: FastifyInstance) {
  // Register Swagger
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Suske en Wiske API',
        description: 'REST API for Suske en Wiske comic book database',
        version: '1.0.0',
      },
      servers: [
        process.env.NODE_ENV !== 'production' && {
          url: 'http://localhost:4002',
          description: 'Development server',
        },
        {
          url: 'https://playground-rest.vercel.app',
          description: 'Production server',
        },
      ],
      tags: [
        { name: 'Albums', description: 'Comic book albums endpoints' },
        { name: 'Characters', description: 'Character endpoints' },
        { name: 'Artists', description: 'Artist endpoints' },
        { name: 'Collections', description: 'Collection endpoints' },
      ],
    },
  } as any);

  // Register Swagger UI
  await app.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });
}

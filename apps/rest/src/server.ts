import cors from '@fastify/cors';
import Fastify from 'fastify';
import { setupSwagger } from './plugins/swagger.js';
import { albumRoutes } from './routes/albums.js';
import { artistRoutes } from './routes/artists.js';
import { characterRoutes } from './routes/characters.js';
import { collectionRoutes } from './routes/collections.js';
import { registerCommonSchemas } from './schemas/common.js';

const app: Fastify.FastifyInstance = Fastify({
  logger: true,
});

async function main() {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Register common schemas (must be done before routes)
  registerCommonSchemas(app);

  // Register Swagger
  await setupSwagger(app);

  // Register routes
  await app.register(albumRoutes);
  await app.register(characterRoutes);
  await app.register(artistRoutes);
  await app.register(collectionRoutes);

  // 3️⃣ Start server
  await app.listen({ port: 4002, host: '0.0.0.0' });
  console.log('🚀 REST API ready on http://localhost:4002');
  console.log(
    '📚 API Documentation available at http://localhost:4002/documentation'
  );
}

main().catch((err) => {
  console.error(err);
});

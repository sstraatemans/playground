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
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      // TODO: make something nice
      if (!origin) return callback(null, true);

      const allowedOrigins = ['http://localhost:3000'];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
  await app.listen({ port: 4000, host: '0.0.0.0' });
  console.log('🚀 REST API ready on http://localhost:4000');
  console.log(
    '📚 API Documentation available at http://localhost:4000/documentation'
  );
}

main().catch((err) => {
  console.error(err);
});

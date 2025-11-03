// src/server/trpc/index.ts
import { albumsRouter } from './routes/albums/index.js';
import { router } from './trpc.js';

export const appRouter = router({
  albums: albumsRouter,
});

export type AppRouter = typeof appRouter;

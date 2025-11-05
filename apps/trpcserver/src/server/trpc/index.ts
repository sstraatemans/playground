// src/server/trpc/index.ts
import { albumsRouter } from './routes/albums/index.js';
import { charactersRouter } from './routes/characters/index.js';
import { seriesRouter } from './routes/series/index.js';
import { router } from './trpc.js';

export const appRouter = router({
  albums: albumsRouter,
  characters: charactersRouter,
  series: seriesRouter,
});

export type AppRouter = typeof appRouter;

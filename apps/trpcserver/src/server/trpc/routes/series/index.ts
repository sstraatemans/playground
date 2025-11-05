import { getSerieAlbumsById } from 'db/series/getSerieAlbumsById.js';
import z from 'zod';
import { allSeries } from '../../../../db/series/allSeries.js';
import { getSerieById } from '../../../../db/series/getSerieById.js';
import { procedure, router } from '../../trpc.js';

export const seriesRouter = router({
  all: procedure.query(async () => {
    return await allSeries();
  }),
  getSerieById: procedure.input(z.string()).query(async ({ input }) => {
    return await getSerieById(input);
  }),
  getSerieAlbumsById: procedure.input(z.string()).query(async ({ input }) => {
    return await getSerieAlbumsById(input);
  }),
});

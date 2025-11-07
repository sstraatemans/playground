import { serieCount } from 'db/series/serieCount.js';
import z from 'zod';
import {
  allSeries,
  AllSeriessSchema,
} from '../../../../db/series/allSeries.js';
import { getSerieAlbumsById } from '../../../../db/series/getSerieAlbumsById.js';
import { getSerieById } from '../../../../db/series/getSerieById.js';
import { procedure, router } from '../../trpc.js';

export const seriesRouter = router({
  count: procedure.query(async () => {
    return await serieCount();
  }),
  all: procedure.input(AllSeriessSchema).query(async ({ input }) => {
    return await allSeries(input);
  }),
  getSerieById: procedure.input(z.string()).query(async ({ input }) => {
    return await getSerieById(input);
  }),
  getSerieAlbumsById: procedure.input(z.string()).query(async ({ input }) => {
    return await getSerieAlbumsById(input);
  }),
});

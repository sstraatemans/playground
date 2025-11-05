import { allSeries } from '@/db/series/allSeries.js';
import { procedure, router } from '../../trpc.js';

export const seriesRouter = router({
  all: procedure.query(async () => {
    return await allSeries();
  }),
});

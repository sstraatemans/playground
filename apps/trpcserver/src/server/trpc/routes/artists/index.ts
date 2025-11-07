import { artistCount } from 'db/artists/artistCount.js';
import z from 'zod';
import {
  allArtists,
  AllArtistsSchema,
} from '../../../../db/artists/allArtists.js';
import { getArtistAlbumsById } from '../../../../db/artists/getArtistAlbumsById.js';
import { getArtistById } from '../../../../db/artists/getArtistById.js';
import { procedure, router } from '../../trpc.js';

export const artistsRouter = router({
  count: procedure.query(async () => {
    return await artistCount();
  }),
  all: procedure.input(AllArtistsSchema).query(async ({ input }) => {
    return await allArtists(input);
  }),
  getArtistById: procedure.input(z.number()).query(async ({ input }) => {
    return await getArtistById(input);
  }),
  getArtistAlbumsById: procedure.input(z.number()).query(async ({ input }) => {
    return await getArtistAlbumsById(input);
  }),
});

import { getArtistAlbumsById } from 'db/artists/getArtistAlbumsById.js';
import z from 'zod';
import { allArtists } from '../../../../db/artists/allArtists.js';
import { getArtistById } from '../../../../db/artists/getArtistById.js';
import { procedure, router } from '../../trpc.js';

export const artistsRouter = router({
  all: procedure.query(async () => {
    return await allArtists();
  }),
  getArtistById: procedure.input(z.number()).query(async ({ input }) => {
    return await getArtistById(input);
  }),
  getArtistAlbumsById: procedure.input(z.number()).query(async ({ input }) => {
    return await getArtistAlbumsById(input);
  }),
});

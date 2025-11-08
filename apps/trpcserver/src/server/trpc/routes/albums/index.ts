import z from 'zod';
import { albumCount } from '../../../../db/albums/albumCount.js';
import { allAlbums, AllAlbumsSchema } from '../../../../db/albums/allAlbums.js';
import { getAlbumById } from '../../../../db/albums/getAlbumById.js';
import { getAlbumCharactersById } from '../../../../db/albums/getAlbumCharactersById.js';
import { getAlbumSeriesById } from '../../../../db/albums/getAlbumSeriesById.js';
import { procedure, router } from '../../trpc.js';

export const albumsRouter = router({
  count: procedure.query(async () => {
    return await albumCount();
  }),
  all: procedure.input(AllAlbumsSchema).query(async ({ input }) => {
    return await allAlbums(input);
  }),
  getAlbumById: procedure.input(z.number()).query(async ({ input }) => {
    return await getAlbumById(input);
  }),
  getAlbumCharactersById: procedure
    .input(z.number())
    .query(async ({ input }) => {
      return await getAlbumCharactersById(input);
    }),
  getAlbumSeriesById: procedure.input(z.number()).query(async ({ input }) => {
    return await getAlbumSeriesById(input);
  }),
});

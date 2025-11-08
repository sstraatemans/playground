import z from 'zod';
import { albumCount } from '../../../../db/albums/albumCount.js';
import { allAlbums, AllAlbumsSchema } from '../../../../db/albums/allAlbums.js';
import { getAlbumById } from '../../../../db/albums/getAlbumById.js';
import { getAlbumCharactersById } from '../../../../db/albums/getAlbumCharactersById.js';
import { getAlbumCollectionsById } from '../../../../db/albums/getAlbumCollectionsById.js';
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
  getAlbumCollectionsById: procedure
    .input(z.number())
    .query(async ({ input }) => {
      return await getAlbumCollectionsById(input);
    }),
});

import { allAlbums } from '@/db/albums/allAlbums.js';
import { procedure, router } from '../../trpc.js';

export const albumsRouter = router({
  all: procedure.query(async () => {
    return await allAlbums();
  }),
});

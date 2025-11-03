import z from 'zod';
import { allAlbums } from '../../../../db/albums/allAlbums.js';
import { getAlbumById } from '../../../../db/albums/getAlbumById.js';
import { procedure, router } from '../../trpc.js';
export const albumsRouter = router({
    all: procedure.query(async () => {
        return await allAlbums();
    }),
    getAlbumById: procedure.input(z.number()).query(async ({ input }) => {
        return await getAlbumById(input);
    }),
});

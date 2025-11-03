import { procedure, router } from '../../trpc.js';
export const albumsRouter = router({
    all: procedure.query(() => {
        return [{ title: 'De poenschepper', nummer: 67 }];
    }),
});

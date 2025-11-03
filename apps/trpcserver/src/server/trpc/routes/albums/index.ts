// src/server/trpc/routers/user.ts
import { z } from 'zod';

import { procedure, router } from '../../trpc.js';

export const albumsRouter = router({
  all: procedure.query(() => {
    return [
      {
        number: 67,
        title: 'De poenschepper',
        date: '1967-03-01',
      },
      {
        number: 68,
        title: 'Het eiland Amoras',
        date: '1967-04-01',
      },
    ];
  }),
});

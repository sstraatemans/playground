import z from 'zod';
import { allCharacters } from '../../../../db/characters/allCharacters.js';
import { getCharacterById } from '../../../../db/characters/getCharacterById.js';
import { getCharactersAlbumsById } from '../../../../db/characters/getCharactersAlbumsById.js';
import { procedure, router } from '../../trpc.js';

export const charactersRouter = router({
  all: procedure.query(async () => {
    return await allCharacters();
  }),
  getCharacterById: procedure.input(z.number()).query(async ({ input }) => {
    return await getCharacterById(input);
  }),
  getCharactersAlbumsById: procedure
    .input(z.number())
    .query(async ({ input }) => {
      return await getCharactersAlbumsById(input);
    }),
});

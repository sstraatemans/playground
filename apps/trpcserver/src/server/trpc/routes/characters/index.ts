import { characterCount } from 'db/characters/characterCount.js';
import z from 'zod';
import {
  allCharacters,
  AllCharactersSchema,
} from '../../../../db/characters/allCharacters.js';
import { getCharacterById } from '../../../../db/characters/getCharacterById.js';
import { getCharactersAlbumsById } from '../../../../db/characters/getCharactersAlbumsById.js';
import { procedure, router } from '../../trpc.js';

export const charactersRouter = router({
  count: procedure.query(async () => {
    // This is just a placeholder, implement as needed
    return await characterCount();
  }),
  all: procedure.input(AllCharactersSchema).query(async ({ input }) => {
    return await allCharacters(input);
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

import z from 'zod';
import { CONSTANTS } from '../../constants.js';
import { prisma } from '../client.js';
import { characterCount } from './characterCount.js';

export interface AllCharactersParams {
  offset?: number;
  limit?: number;
}

export const AllCharactersSchema = z
  .object({
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional();

export const allCharacters = async ({
  offset = CONSTANTS.DEFAULT_OFFSET,
  limit = CONSTANTS.DEFAULT_LIMIT,
}: AllCharactersParams = {}) => {
  if (offset < 0) offset = CONSTANTS.DEFAULT_OFFSET;
  if (limit < 1 || limit > CONSTANTS.DEFAULT_LIMIT)
    limit = CONSTANTS.DEFAULT_LIMIT;

  const data = await prisma.character.findMany({
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' },
  });
  return { totalCount: await characterCount(), characters: data };
};

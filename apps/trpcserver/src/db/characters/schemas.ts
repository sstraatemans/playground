import z from 'zod';

export const CharacterOrderBySchema = z.enum(['id', 'name']);

export type CharacterOrderByType = z.infer<typeof CharacterOrderBySchema>;

export const CharacterOrderDirectionSchema = z.enum(['asc', 'desc']);

export type CharacterOrderDirectionType = z.infer<
  typeof CharacterOrderDirectionSchema
>;

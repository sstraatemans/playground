import z from 'zod';

export const ArtistOrderBySchema = z.enum(['id', 'name']);

export type ArtistOrderByType = z.infer<typeof ArtistOrderBySchema>;

export const ArtistOrderDirectionSchema = z.enum(['asc', 'desc']);

export type ArtistOrderDirectionType = z.infer<
  typeof ArtistOrderDirectionSchema
>;

import z from 'zod';

export const AlbumOrderBySchema = z.enum([
  'id',
  'title',
  'date',
  'drawArtist',
  'scenarioArtist',
]);

export type AlbumOrderByType = z.infer<typeof AlbumOrderBySchema>;

export const AlbumOrderDirectionSchema = z.enum(['asc', 'desc']);

export type AlbumOrderDirectionType = z.infer<typeof AlbumOrderDirectionSchema>;

import z from 'zod';

export const CollectionOrderBySchema = z.enum(['id', 'name']);

export type CollectionOrderByType = z.infer<typeof CollectionOrderBySchema>;

export const CollectionOrderDirectionSchema = z.enum(['asc', 'desc']);

export type CollectionOrderDirectionType = z.infer<
  typeof CollectionOrderDirectionSchema
>;

import type { FastifyInstance } from 'fastify';

/**
 * Register common JSON schemas that can be referenced across routes.
 *
 * Note: Album, Character, and Collection schemas match the Zod schemas
 * exported from @sstraatemans/sw_trpcclient (AlbumSchema, CharacterSchema, CollectionSchema).
 * The _links property is added for HAL+JSON compliance.
 */
export function registerCommonSchemas(app: FastifyInstance) {
  // Links schema for HAL+JSON
  app.addSchema({
    $id: 'Links',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        href: { type: 'string' },
        templated: { type: 'boolean' },
        type: { type: 'string' },
        deprecation: { type: 'string' },
        name: { type: 'string' },
        profile: { type: 'string' },
        title: { type: 'string' },
        hreflang: { type: 'string' },
      },
      required: ['href'],
    },
  });

  // Album schema (matches AlbumSchema from trpcclient)
  app.addSchema({
    $id: 'Album',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      date: { type: 'string' },
      scenarioArtistId: { type: ['integer', 'null'], nullable: true },
      drawArtistId: { type: ['integer', 'null'], nullable: true },
      wikiURL: { type: ['string', 'null'], nullable: true },
      description: { type: ['string', 'null'], nullable: true },
      image: { type: ['string', 'null'], nullable: true },
      _links: { $ref: 'Links#' },
    },
    required: ['id', 'title', 'date'],
  });

  // Character schema (matches CharacterSchema from trpcclient)
  app.addSchema({
    $id: 'Character',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      description: { type: 'string' },
      years: { type: 'string' },
      albumsTemp: { type: 'string' },
      wikiURL: { type: ['string', 'null'], nullable: true },
      albumsImported: { type: 'boolean' },
      _links: { $ref: 'Links#' },
    },
    required: [
      'id',
      'name',
      'description',
      'years',
      'albumsTemp',
      'albumsImported',
    ],
  });

  // Artist schema (matches ArtistSchema from trpcclient)
  app.addSchema({
    $id: 'Artist',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      wikiURL: { type: ['string', 'null'], nullable: true },
      image: { type: ['string', 'null'], nullable: true },
      _links: { $ref: 'Links#' },
    },
    required: ['id', 'name'],
  });

  // Collection schema (matches AlbumCollection from trpcclient)
  app.addSchema({
    $id: 'AlbumCollection',
    type: 'object',
    properties: {
      albumId: { type: 'integer' },
      collectionId: { type: 'string' },
      number: { type: 'integer' },
      image: { type: 'string', nullable: true },
      _links: { $ref: 'Links#' },
    },
    required: ['albumId', 'collectionId', 'number', 'image'],
  });

  // Collection schema (matches CollectionSchema from trpcclient)
  app.addSchema({
    $id: 'Collection',
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      startYear: { type: 'string', nullable: true },
      endYear: { type: 'string', nullable: true },
      wikiURL: { type: ['string', 'null'], nullable: true },
      _links: { $ref: 'Links#' },
    },
    required: ['id', 'name', 'startYear', 'endYear'],
  });

  // Pagination info schema
  app.addSchema({
    $id: 'PaginationInfo',
    type: 'object',
    properties: {
      limit: { type: 'integer' },
      offset: { type: 'integer' },
      returned: { type: 'integer' },
    },
    required: ['limit', 'offset', 'returned'],
  });

  // Error response schemas
  app.addSchema({
    $id: 'BadRequest',
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['code', 'message'],
      },
      _links: { $ref: 'Links#' },
    },
    required: ['error', '_links'],
    examples: [
      {
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid pagination parameters',
        },
        _links: {
          self: { href: '/v1/albums' },
        },
      },
    ],
  });

  app.addSchema({
    $id: 'NotFound',
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['code', 'message'],
      },
      _links: { $ref: 'Links#' },
    },
    required: ['error', '_links'],
    examples: [
      {
        error: {
          code: 'NOT_FOUND',
          message: 'Album not found',
        },
        _links: {
          self: { href: '/v1/albums/67' },
        },
      },
    ],
  });

  app.addSchema({
    $id: 'ServerError',
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['code', 'message'],
      },
      _links: { $ref: 'Links#' },
    },
    required: ['error', '_links'],
    examples: [
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error fetching albums',
        },
        _links: {
          self: { href: '/v1/albums' },
        },
      },
    ],
  });
}

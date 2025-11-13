import type { FastifyInstance } from 'fastify';

/**
 * Register common JSON schemas that can be referenced across routes
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
  });
}

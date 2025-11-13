import { CollectionSchema } from '@sstraatemans/sw_trpcclient';
import type { FastifyInstance } from 'fastify';
import { trpcClient } from 'utils/client.js';
import z from 'zod';
import {
  buildPaginationLinks,
  buildResourceLinks,
  buildErrorResponse,
  parsePaginationParams,
} from '../utils/hal.js';

export async function collectionRoutes(app: FastifyInstance) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

  // GET /v1/collections - List all collections with pagination
  app.get(
    '/v1/collections',
    {
      schema: {
        summary: 'Get paginated collections',
        description:
          'Returns a paginated collection of comic collections following HAL+JSON conventions. Clients **must** follow `_links` for navigation (next/prev/first/last).',
        tags: ['Collections'],
        querystring: {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
              description: 'Number of items per page',
            },
            offset: {
              type: 'integer',
              minimum: 0,
              default: 0,
              description: 'Offset for pagination (zero-based)',
            },
          },
        },
        response: {
          200: {
            description:
              'Successful response – paginated collection of collections',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              collections: {
                type: 'array',
                items: { $ref: 'Collection#' },
              },
              totalCount: { type: 'integer' },
              page: { $ref: 'PaginationInfo#' },
            },
            examples: [
              {
                _links: {
                  self: { href: '/v1/collections?limit=10&offset=0' },
                  next: { href: '/v1/collections?limit=10&offset=10' },
                  first: { href: '/v1/collections?limit=10&offset=0' },
                  last: { href: '/v1/collections?limit=10&offset=40' },
                  collection: { href: '/v1/collections' },
                },
                collections: [
                  {
                    id: '1',
                    name: 'De Blauwe Reeks',
                    _links: {
                      self: { href: '/v1/collections/1' },
                    },
                  },
                  {
                    id: '2',
                    name: 'De Rode Reeks',
                    _links: {
                      self: { href: '/v1/collections/2' },
                    },
                  },
                ],
                totalCount: 50,
                page: {
                  limit: 10,
                  offset: 0,
                  returned: 2,
                },
              },
            ],
          },
          400: { $ref: 'BadRequest#' },
          500: { $ref: 'ServerError#' },
        },
      },
    },
    async (request, reply) => {
      const { limit: rawLimit, offset: rawOffset } = request.query as {
        limit?: string;
        offset?: string;
      };

      const { limit, offset, error } = parsePaginationParams(
        rawLimit,
        rawOffset
      );

      if (error) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'BAD_REQUEST',
              error,
              `${baseUrl}/v1/collections`
            )
          );
      }

      try {
        const { data, totalCount } = await trpcClient.collections.all.query({
          limit,
          offset,
        });

        const parsedCollections = z.array(CollectionSchema).parse(data);
        const collectionsBaseUrl = `${baseUrl}/v1/collections`;

        const _links = buildPaginationLinks({
          limit,
          offset,
          totalCount,
          baseUrl: collectionsBaseUrl,
        });

        const collectionsWithLinks = parsedCollections.map((collection) => ({
          ...collection,
          _links: {
            self: { href: `${collectionsBaseUrl}/${collection.id}` },
          },
        }));

        return reply
          .code(200)
          .header('Content-Type', 'application/hal+json')
          .header(
            'Cache-Control',
            'public, s-maxage=60, stale-while-revalidate=30'
          )
          .header('X-Total-Count', totalCount.toString())
          .send({
            _links,
            collections: collectionsWithLinks,
            totalCount,
            page: { limit, offset, returned: parsedCollections.length },
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return reply
          .code(500)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Error fetching collections',
              `${baseUrl}/v1/collections`
            )
          );
      }
    }
  );

  // GET /v1/collections/:id - Get a single collection by ID
  app.get(
    '/v1/collections/:id',
    {
      schema: {
        summary: 'Get a collection by ID',
        description:
          'Returns a single collection by ID following HAL+JSON conventions. Clients **must** follow `_links` for navigation.',
        tags: ['Collections'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Successful response – single collection resource',
            allOf: [{ $ref: 'Collection#' }],
            examples: [
              {
                id: '1',
                name: 'De Blauwe Reeks',
                _links: {
                  self: { href: '/v1/collections/1' },
                  collection: { href: '/v1/collections' },
                },
              },
            ],
          },
          404: { $ref: 'NotFound#' },
          400: { $ref: 'BadRequest#' },
          500: { $ref: 'ServerError#' },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const collectionsBaseUrl = `${baseUrl}/v1/collections`;
      const selfUrl = `${collectionsBaseUrl}/${id}`;

      if (!id) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse('BAD_REQUEST', 'Invalid collection ID', selfUrl)
          );
      }

      try {
        const data = await trpcClient.collections.getCollectionById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send(
              buildErrorResponse('NOT_FOUND', 'Collection not found', selfUrl)
            );
        }

        const parsedCollection = CollectionSchema.parse(data);
        const _links = buildResourceLinks(selfUrl, collectionsBaseUrl);

        return reply
          .code(200)
          .header('Content-Type', 'application/hal+json')
          .header(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=60'
          )
          .send({
            ...parsedCollection,
            _links,
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return reply
          .code(500)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Error fetching collection',
              selfUrl
            )
          );
      }
    }
  );

  // GET /v1/collections/:id/albums - Get all albums in a collection
  app.get(
    '/v1/collections/:id/albums',
    {
      schema: {
        summary: 'Get all albums in a collection by collectionId',
        description:
          'Returns an array of albums in a collection following HAL+JSON conventions. Clients **must** follow `_links` for navigation.',
        tags: ['Collections'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description:
              'Successful response – array of albums in a collection',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              albums: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    albumId: { type: 'integer' },
                    number: {
                      anyOf: [{ type: 'integer' }, { type: 'null' }],
                      nullable: true,
                    },
                    _links: { $ref: 'Links#' },
                  },
                  required: ['albumId', '_links'],
                },
              },
              totalCount: { type: 'integer' },
            },
            examples: [
              {
                _links: {
                  self: { href: '/v1/collections/1/albums' },
                  collection: { href: '/v1/collections/1' },
                  collections: { href: '/v1/collections' },
                  albums: { href: '/v1/albums' },
                },
                albums: [
                  {
                    albumId: 67,
                    number: 1,
                    _links: {
                      self: { href: '/v1/albums/67' },
                    },
                  },
                  {
                    albumId: 68,
                    number: 2,
                    _links: {
                      self: { href: '/v1/albums/68' },
                    },
                  },
                ],
                totalCount: 2,
              },
            ],
          },
          404: { $ref: 'NotFound#' },
          400: { $ref: 'BadRequest#' },
          500: { $ref: 'ServerError#' },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const collectionUrl = `${baseUrl}/v1/collections/${id}`;
      const selfUrl = `${collectionUrl}/albums`;

      if (!id) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse('BAD_REQUEST', 'Invalid collection ID', selfUrl)
          );
      }

      try {
        const data =
          await trpcClient.collections.getCollectionAlbumsById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send({
              error: { code: 'NOT_FOUND', message: 'Collection not found' },
              _links: {
                self: { href: selfUrl },
                collection: { href: collectionUrl },
                collections: { href: `${baseUrl}/v1/collections` },
              },
            });
        }

        const albumsWithLinks = data.map((album: any) => ({
          ...album,
          _links: {
            self: { href: `${baseUrl}/v1/albums/${album.albumId}` },
          },
        }));

        return reply
          .code(200)
          .header('Content-Type', 'application/hal+json')
          .header(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=60'
          )
          .send({
            _links: {
              self: { href: selfUrl },
              collection: { href: collectionUrl },
              collections: { href: `${baseUrl}/v1/collections` },
              albums: { href: `${baseUrl}/v1/albums` },
            },
            albums: albumsWithLinks,
            totalCount: data.length,
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return reply
          .code(500)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Error fetching collection albums',
              selfUrl
            )
          );
      }
    }
  );
}

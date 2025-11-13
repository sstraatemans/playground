import { CollectionSchema } from '@sstraatemans/sw_trpcclient';
import { createClient } from '@sstraatemans/sw_trpcclient';
import type { FastifyInstance } from 'fastify';
import z from 'zod';
import {
  buildPaginationLinks,
  buildResourceLinks,
  buildErrorResponse,
  parsePaginationParams,
} from '../utils/hal.js';

const trpcClient = createClient({
  url:
    process.env.TRPC_SERVER_URL ||
    'https://playground-trpcserver.vercel.app/trpc/v1',
});

export async function collectionRoutes(app: FastifyInstance) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

  // GET /v1/collections - List all collections with pagination
  app.get(
    '/v1/collections',
    {
      schema: {
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
        tags: ['Collections'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: { $ref: 'Collection#' },
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

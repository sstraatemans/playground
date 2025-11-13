import { AlbumSchema } from '@sstraatemans/sw_trpcclient';
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

export async function albumRoutes(app: FastifyInstance) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

  // GET /v1/albums - List all albums with pagination
  app.get(
    '/v1/albums',
    {
      schema: {
        tags: ['Albums'],
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
            description: 'Successful response – paginated collection of albums',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              albums: {
                type: 'array',
                items: { $ref: 'Album#' },
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
            buildErrorResponse('BAD_REQUEST', error, `${baseUrl}/v1/albums`)
          );
      }

      try {
        const { data, totalCount } = await trpcClient.albums.all.query({
          limit,
          offset,
        });

        const parsedAlbums = z.array(AlbumSchema).parse(data);
        const albumsBaseUrl = `${baseUrl}/v1/albums`;

        const _links = buildPaginationLinks({
          limit,
          offset,
          totalCount,
          baseUrl: albumsBaseUrl,
        });

        const albumsWithLinks = parsedAlbums.map((album) => ({
          ...album,
          _links: {
            self: { href: `${albumsBaseUrl}/${album.id}` },
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
            albums: albumsWithLinks,
            totalCount,
            page: { limit, offset, returned: parsedAlbums.length },
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return reply
          .code(500)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Error fetching albums',
              `${baseUrl}/v1/albums`
            )
          );
      }
    }
  );

  // GET /v1/albums/:id - Get a single album by ID
  app.get(
    '/v1/albums/:id',
    {
      schema: {
        tags: ['Albums'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            $ref: 'Album#',
          },
          404: { $ref: 'NotFound#' },
          400: { $ref: 'BadRequest#' },
          500: { $ref: 'ServerError#' },
        },
      },
    },
    async (request, reply) => {
      const { id: rawId } = request.params as { id: string };
      const id = parseInt(rawId, 10);
      const albumsBaseUrl = `${baseUrl}/v1/albums`;
      const selfUrl = `${albumsBaseUrl}/${rawId}`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(buildErrorResponse('BAD_REQUEST', 'Invalid album ID', selfUrl));
      }

      try {
        const data = await trpcClient.albums.getAlbumById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send(buildErrorResponse('NOT_FOUND', 'Album not found', selfUrl));
        }

        const parsedAlbum = AlbumSchema.parse(data);
        const _links = buildResourceLinks(selfUrl, albumsBaseUrl);

        return reply
          .code(200)
          .header('Content-Type', 'application/hal+json')
          .header(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=60'
          )
          .send({
            ...parsedAlbum,
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
              'Error fetching album',
              selfUrl
            )
          );
      }
    }
  );

  // GET /v1/albums/:id/characters - Get all characters in an album
  app.get(
    '/v1/albums/:id/characters',
    {
      schema: {
        tags: ['Albums'],
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
              'Successful response – array of characters in an album',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              characters: {
                type: 'array',
                items: { $ref: 'Character#' },
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
      const { id: rawId } = request.params as { id: string };
      const id = parseInt(rawId, 10);
      const albumUrl = `${baseUrl}/v1/albums/${rawId}`;
      const selfUrl = `${albumUrl}/characters`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(buildErrorResponse('BAD_REQUEST', 'Invalid album ID', selfUrl));
      }

      try {
        const data = await trpcClient.albums.getAlbumCharactersById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send({
              error: { code: 'NOT_FOUND', message: 'Album not found' },
              _links: {
                self: { href: selfUrl },
                album: { href: albumUrl },
                albums: { href: `${baseUrl}/v1/albums` },
              },
            });
        }

        const charactersWithLinks = data.map((character: any) => ({
          ...character,
          _links: {
            self: { href: `${baseUrl}/v1/characters/${character.id}` },
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
              album: { href: albumUrl },
              albums: { href: `${baseUrl}/v1/albums` },
              characters: { href: `${baseUrl}/v1/characters` },
            },
            characters: charactersWithLinks,
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
              'Error fetching album characters',
              selfUrl
            )
          );
      }
    }
  );

  // GET /v1/albums/:id/collections - Get all collections that include an album
  app.get(
    '/v1/albums/:id/collections',
    {
      schema: {
        tags: ['Albums'],
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
              'Successful response – array of collections that include an album',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              collections: {
                type: 'array',
                items: { $ref: 'Collection#' },
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
      const { id: rawId } = request.params as { id: string };
      const id = parseInt(rawId, 10);
      const albumUrl = `${baseUrl}/v1/albums/${rawId}`;
      const selfUrl = `${albumUrl}/collections`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(buildErrorResponse('BAD_REQUEST', 'Invalid album ID', selfUrl));
      }

      try {
        const data = await trpcClient.albums.getAlbumCollectionsById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send({
              error: { code: 'NOT_FOUND', message: 'Album not found' },
              _links: {
                self: { href: selfUrl },
                album: { href: albumUrl },
                albums: { href: `${baseUrl}/v1/albums` },
              },
            });
        }

        const collectionsWithLinks = data.map((collection: any) => ({
          ...collection,
          _links: {
            self: { href: `${baseUrl}/v1/collections/${collection.id}` },
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
              album: { href: albumUrl },
              albums: { href: `${baseUrl}/v1/albums` },
              collections: { href: `${baseUrl}/v1/collections` },
            },
            collections: collectionsWithLinks,
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
              'Error fetching album collections',
              selfUrl
            )
          );
      }
    }
  );
}

import { ArtistSchema } from '@sstraatemans/sw_trpcclient';
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

export async function artistRoutes(app: FastifyInstance) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

  // GET /v1/artists - List all artists with pagination
  app.get(
    '/v1/artists',
    {
      schema: {
        tags: ['Artists'],
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
              'Successful response – paginated collection of artists',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              artists: {
                type: 'array',
                items: { $ref: 'Artist#' },
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
            buildErrorResponse('BAD_REQUEST', error, `${baseUrl}/v1/artists`)
          );
      }

      try {
        const { data, totalCount } = await trpcClient.artists.all.query({
          limit,
          offset,
        });

        const parsedArtists = z.array(ArtistSchema).parse(data);
        const artistsBaseUrl = `${baseUrl}/v1/artists`;

        const _links = buildPaginationLinks({
          limit,
          offset,
          totalCount,
          baseUrl: artistsBaseUrl,
        });

        const artistsWithLinks = parsedArtists.map((artist) => ({
          ...artist,
          _links: {
            self: { href: `${artistsBaseUrl}/${artist.id}` },
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
            artists: artistsWithLinks,
            totalCount,
            page: { limit, offset, returned: parsedArtists.length },
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return reply
          .code(500)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Error fetching artists',
              `${baseUrl}/v1/artists`
            )
          );
      }
    }
  );

  // GET /v1/artists/:id - Get a single artist by ID
  app.get(
    '/v1/artists/:id',
    {
      schema: {
        tags: ['Artists'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: { $ref: 'Artist#' },
          404: { $ref: 'NotFound#' },
          400: { $ref: 'BadRequest#' },
          500: { $ref: 'ServerError#' },
        },
      },
    },
    async (request, reply) => {
      const { id: rawId } = request.params as { id: string };
      const id = parseInt(rawId, 10);
      const artistsBaseUrl = `${baseUrl}/v1/artists`;
      const selfUrl = `${artistsBaseUrl}/${rawId}`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse('BAD_REQUEST', 'Invalid artist ID', selfUrl)
          );
      }

      try {
        const data = await trpcClient.artists.getArtistById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send(buildErrorResponse('NOT_FOUND', 'Artist not found', selfUrl));
        }

        const parsedArtist = ArtistSchema.parse(data);
        const _links = buildResourceLinks(selfUrl, artistsBaseUrl);

        return reply
          .code(200)
          .header('Content-Type', 'application/hal+json')
          .header(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=60'
          )
          .send({
            ...parsedArtist,
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
              'Error fetching artist',
              selfUrl
            )
          );
      }
    }
  );

  // GET /v1/artists/:id/albums - Get all albums by an artist
  app.get(
    '/v1/artists/:id/albums',
    {
      schema: {
        tags: ['Artists'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Successful response – array of albums of an artist',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              albums: {
                type: 'array',
                items: { $ref: 'Album#' },
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
      const artistUrl = `${baseUrl}/v1/artists/${rawId}`;
      const selfUrl = `${artistUrl}/albums`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse('BAD_REQUEST', 'Invalid artist ID', selfUrl)
          );
      }

      try {
        const data = await trpcClient.artists.getArtistAlbumsById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send({
              error: { code: 'NOT_FOUND', message: 'Artist not found' },
              _links: {
                self: { href: selfUrl },
                artist: { href: artistUrl },
                artists: { href: `${baseUrl}/v1/artists` },
              },
            });
        }

        const albumsWithLinks = data.map((album: any) => ({
          ...album,
          _links: {
            self: { href: `${baseUrl}/v1/albums/${album.id}` },
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
              artist: { href: artistUrl },
              artists: { href: `${baseUrl}/v1/artists` },
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
              'Error fetching artist albums',
              selfUrl
            )
          );
      }
    }
  );
}

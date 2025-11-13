import { CharacterSchema } from '@sstraatemans/sw_trpcclient';
import type { FastifyInstance } from 'fastify';
import { trpcClient } from 'utils/client.js';
import z from 'zod';
import {
  buildPaginationLinks,
  buildResourceLinks,
  buildErrorResponse,
  parsePaginationParams,
} from '../utils/hal.js';

export async function characterRoutes(app: FastifyInstance) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

  // GET /v1/characters - List all characters with pagination
  app.get(
    '/v1/characters',
    {
      schema: {
        summary: 'Get paginated characters',
        description:
          'Returns a paginated collection of characters following HAL+JSON conventions. Clients **must** follow `_links` for navigation (next/prev/first/last)',
        tags: ['Characters'],
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
              'Successful response – paginated collection of characters',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              characters: {
                type: 'array',
                items: { $ref: 'Character#' },
              },
              totalCount: { type: 'integer' },
              page: { $ref: 'PaginationInfo#' },
            },
            examples: [
              {
                _links: {
                  self: { href: '/v1/characters?limit=10&offset=0' },
                  next: { href: '/v1/characters?limit=10&offset=10' },
                  first: { href: '/v1/characters?limit=10&offset=0' },
                  last: { href: '/v1/characters?limit=10&offset=90' },
                  collection: { href: '/v1/characters' },
                },
                characters: [
                  {
                    id: 1,
                    name: 'Suske',
                    _links: {
                      self: { href: '/v1/characters/1' },
                    },
                  },
                  {
                    id: 2,
                    name: 'Wiske',
                    _links: {
                      self: { href: '/v1/characters/2' },
                    },
                  },
                ],
                totalCount: 100,
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
            buildErrorResponse('BAD_REQUEST', error, `${baseUrl}/v1/characters`)
          );
      }

      try {
        const { data, totalCount } = await trpcClient.characters.all.query({
          limit,
          offset,
        });

        const parsedCharacters = z.array(CharacterSchema).parse(data);
        const charactersBaseUrl = `${baseUrl}/v1/characters`;

        const _links = buildPaginationLinks({
          limit,
          offset,
          totalCount,
          baseUrl: charactersBaseUrl,
        });

        const charactersWithLinks = parsedCharacters.map((character) => ({
          ...character,
          _links: {
            self: { href: `${charactersBaseUrl}/${character.id}` },
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
            characters: charactersWithLinks,
            totalCount,
            page: { limit, offset, returned: parsedCharacters.length },
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return reply
          .code(500)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse(
              'INTERNAL_SERVER_ERROR',
              'Error fetching characters',
              `${baseUrl}/v1/characters`
            )
          );
      }
    }
  );

  // GET /v1/characters/:id - Get a single character by ID
  app.get(
    '/v1/characters/:id',
    {
      schema: {
        summary: 'Get a character by ID',
        description:
          'Returns a single character by ID following HAL+JSON conventions. Clients **must** follow `_links` for navigation.',
        tags: ['Characters'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Successful response – single character resource',
            allOf: [{ $ref: 'Character#' }],
            examples: [
              {
                id: 1,
                name: 'Suske',
                _links: {
                  self: { href: '/v1/characters/1' },
                  collection: { href: '/v1/characters' },
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
      const { id: rawId } = request.params as { id: string };
      const id = parseInt(rawId, 10);
      const charactersBaseUrl = `${baseUrl}/v1/characters`;
      const selfUrl = `${charactersBaseUrl}/${rawId}`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse('BAD_REQUEST', 'Invalid character ID', selfUrl)
          );
      }

      try {
        const data = await trpcClient.characters.getCharacterById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send(
              buildErrorResponse('NOT_FOUND', 'Character not found', selfUrl)
            );
        }

        const parsedCharacter = CharacterSchema.parse(data);
        const _links = buildResourceLinks(selfUrl, charactersBaseUrl);

        return reply
          .code(200)
          .header('Content-Type', 'application/hal+json')
          .header(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=60'
          )
          .send({
            ...parsedCharacter,
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
              'Error fetching character',
              selfUrl
            )
          );
      }
    }
  );

  // GET /v1/characters/:id/albums - Get all albums where the character appears
  app.get(
    '/v1/characters/:id/albums',
    {
      schema: {
        summary:
          'Get all albums where the character makes an appearance by characterId',
        description:
          'Returns an array of albums where the character makes an appearance following HAL+JSON conventions. Clients **must** follow `_links` for navigation',
        tags: ['Characters'],
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
              'Successful response – array of albums where the character appears',
            type: 'object',
            properties: {
              _links: { $ref: 'Links#' },
              albums: {
                type: 'array',
                items: { $ref: 'Album#' },
              },
              totalCount: { type: 'integer' },
            },
            examples: [
              {
                _links: {
                  self: { href: '/v1/characters/1/albums' },
                  character: { href: '/v1/characters/1' },
                  characters: { href: '/v1/characters' },
                  albums: { href: '/v1/albums' },
                },
                albums: [
                  {
                    id: 67,
                    title: 'Jeromba de Griek',
                    date: '1965-10-11',
                    _links: {
                      self: { href: '/v1/albums/67' },
                    },
                  },
                  {
                    id: 68,
                    title: 'De sprietatoom',
                    date: '1946-05-15',
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
      const { id: rawId } = request.params as { id: string };
      const id = parseInt(rawId, 10);
      const characterUrl = `${baseUrl}/v1/characters/${rawId}`;
      const selfUrl = `${characterUrl}/albums`;

      if (!rawId || isNaN(id) || id < 1) {
        return reply
          .code(400)
          .header('Content-Type', 'application/hal+json')
          .send(
            buildErrorResponse('BAD_REQUEST', 'Invalid character ID', selfUrl)
          );
      }

      try {
        const data =
          await trpcClient.characters.getCharactersAlbumsById.query(id);

        if (!data) {
          return reply
            .code(404)
            .header('Content-Type', 'application/hal+json')
            .send({
              error: { code: 'NOT_FOUND', message: 'Character not found' },
              _links: {
                self: { href: selfUrl },
                character: { href: characterUrl },
                characters: { href: `${baseUrl}/v1/characters` },
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
              character: { href: characterUrl },
              characters: { href: `${baseUrl}/v1/characters` },
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
              'Error fetching character albums',
              selfUrl
            )
          );
      }
    }
  );
}

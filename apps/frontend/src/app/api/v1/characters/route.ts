import { trpcClient } from "@/utils/trpcClient";
import { CharacterSchema } from "@sw/trpcclient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import z from "zod";

/**
 * @swagger
 * /api/v1/characters:
 *   get:
 *     summary: Get paginated characters
 *     description: |
 *       Returns a paginated collection of characters following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation (next/prev/first/last).
 *     operationId: getCharacters
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Offset for pagination (zero-based)
 *     responses:
 *       200:
 *         description: Successful response – paginated collection of characters
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/CharacterCollection'
 *             examples:
 *               default:
 *                 summary: Example with 2 characters (page 1)
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/characters?limit=50&offset=0" }
 *                     next: { href: "/api/v1/characters?limit=50&offset=50" }
 *                     prev: { href: "/api/v1/characters?limit=50&offset=0" }
 *                     first: { href: "/api/v1/characters?limit=50&offset=0" }
 *                     last: { href: "/api/v1/characters?limit=50&offset=2950" }
 *                     collection: { href: "/api/v1/characters" }
 *                   characters:
 *                     - id: 1
 *                       name: "Suske"
 *                       description: "De dappere jongen met het witte hemd en zwarte broek"
 *                       years: "1945-heden"
 *                       wikiURL: "https://nl.wikipedia.org/wiki/Suske"
 *                       _links:
 *                         self: { href: "/api/v1/characters/1" }
 *                     - id: 2
 *                       name: "Wiske"
 *                       description: "Het slimme meisje met de strik en pop Schanulleke"
 *                       years: "1945-heden"
 *                       wikiURL: "https://nl.wikipedia.org/wiki/Wiske"
 *                       _links:
 *                         self: { href: "/api/v1/characters/2" }
 *                   totalCount: 2987
 *                   page:
 *                     limit: 50
 *                     offset: 0
 *                     returned: 2
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawLimit = searchParams.get("limit");
  const rawOffset = searchParams.get("offset");

  const limit = rawLimit ? parseInt(rawLimit, 10) : 50;
  const offset = rawOffset ? parseInt(rawOffset, 10) : 0;

  if (isNaN(limit) || isNaN(offset) || limit < 1 || limit > 100 || offset < 0) {
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Invalid pagination" },
        _links: { self: { href: new URL(request.url).pathname } },
      },
      { status: 400 },
    );
  }

  try {
    const { data, totalCount } = await trpcClient.characters.all.query({
      limit,
      offset,
    });

    const parsedCharacters = z.array(CharacterSchema).parse(data);
    const baseUrl = `${request.nextUrl.origin}/api/v1/characters`;
    const selfUrl = `${baseUrl}?limit=${limit}&offset=${offset}`;

    const hasNext = offset + limit < totalCount;
    const hasPrev = offset > 0;
    const lastOffset = Math.floor((totalCount - 1) / limit) * limit;

    const _links = {
      self: { href: selfUrl },
      first: { href: `${baseUrl}?limit=${limit}&offset=0` },
      last: { href: `${baseUrl}?limit=${limit}&offset=${lastOffset}` },
      collection: { href: baseUrl },
      ...(hasNext && {
        next: { href: `${baseUrl}?limit=${limit}&offset=${offset + limit}` },
      }),
      ...(hasPrev && {
        prev: {
          href: `${baseUrl}?limit=${limit}&offset=${Math.max(0, offset - limit)}`,
        },
      }),
    };

    const charactersWithLinks = parsedCharacters.map((character) => ({
      ...character,
      _links: {
        self: { href: `${baseUrl}/${character.id}` },
      },
    }));

    const responseBody = {
      _links,
      characters: charactersWithLinks,
      totalCount,
      page: {
        limit,
        offset,
        returned: parsedCharacters.length,
      },
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/hal+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "X-Total-Count": totalCount.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

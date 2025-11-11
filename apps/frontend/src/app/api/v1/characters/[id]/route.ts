import { trpcClient } from "@/utils/trpcClient";
import { CharacterSchema } from "@sw/trpcclient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/characters/{id}:
 *   get:
 *     summary: Get a character by ID
 *     description: |
 *       Returns a single character by ID following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getCharacterById
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The character ID
 *     responses:
 *       200:
 *         description: Successful response – single character resource
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *             examples:
 *               default:
 *                 summary: Example character
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/characters/1" }
 *                     albums: { href: "/api/v1/characters/1/albums" }
 *                     collection: { href: "/api/v1/characters" }
 *                   id: 1
 *                   name: "Suske"
 *                   description: "Beste vriend van Wiske"
 *                   years: "1945-heden"
 *                   wikiURL: "https://nl.wikipedia.org/wiki/Suske"
 *       404:
 *         description: Character not found
 *         content:
 *           application/hal+json:
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Character not found"
 *               _links:
 *                 self: { href: "/api/v1/characters/1" }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Next.js gives string, not number
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const id = parseInt(rawId, 10);

  // Validation: must be a positive integer
  if (!rawId || isNaN(id) || id < 1) {
    const pathname = new URL(request.url).pathname;
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Invalid character ID" },
        _links: { self: { href: pathname } },
      },
      { status: 400 },
    );
  }

  try {
    const data = await trpcClient.characters.getCharacterById.query(id);

    if (!data) {
      const selfUrl = `${request.nextUrl.origin}/api/v1/characters/${id}`;
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Character not found" },
          _links: { self: { href: selfUrl } },
        },
        { status: 404 },
      );
    }

    const parsedCharacter = CharacterSchema.parse(data);

    const baseUrl = `${request.nextUrl.origin}/api/v1/characters`;
    const selfUrl = `${baseUrl}/${parsedCharacter.id}`;

    const _links = {
      self: { href: selfUrl },
      albums: { href: `${selfUrl}/albums` },
      collection: { href: baseUrl },
    };

    const characterWithLinks = {
      ...parsedCharacter,
      _links,
    };

    return NextResponse.json(characterWithLinks, {
      status: 200,
      headers: {
        "Content-Type": "application/hal+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

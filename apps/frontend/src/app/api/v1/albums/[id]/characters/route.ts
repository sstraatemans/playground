import { trpcClient } from "@/utils/trpcClient";
import { CharacterSchema } from "@sw/s_w_trpcserver";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import z from "zod";

/**
 * @swagger
 * /api/v1/albums/{id}/characters:
 *   get:
 *     summary: Get all characters in an album by albumId
 *     description: |
 *       Returns an array of characters in a specific album following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getAlbumCharacters
 *     tags:
 *       - Albums
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The album ID
 *     responses:
 *       200:
 *         description: Successful response – array of characters in the album
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/CharacterCollection'
 *             examples:
 *               default:
 *                 summary: Example with 2 characters
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/albums/67/characters" }
 *                     album: { href: "/api/v1/albums/67" }
 *                     albums: { href: "/api/v1/albums" }
 *                     characters: { href: "/api/v1/characters" }
 *                   characters:
 *                     - id: 101
 *                       name: "Suske"
 *                       _links:
 *                         self: { href: "/api/v1/characters/101" }
 *                     - id: 102
 *                       name: "Wiske"
 *                       _links:
 *                         self: { href: "/api/v1/characters/102" }
 *                   totalCount: 2
 *       404:
 *         description: Album not found
 *         content:
 *           application/hal+json:
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Album not found"
 *               _links:
 *                 self: { href: "/api/v1/albums/67/characters" }
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

  const baseV1Url = `${request.nextUrl.origin}/api/v1`;
  const albumUrl = `${baseV1Url}/albums/${id}`;
  const selfUrl = `${albumUrl}/${id}/characters`;

  // Validation: must be a positive integer
  if (!rawId || isNaN(id) || id < 1) {
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Invalid album ID" },
        _links: { self: { href: selfUrl } },
      },
      { status: 400 },
    );
  }

  try {
    const data = await trpcClient.albums.getAlbumCharactersById.query(id);

    if (!data) {
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Album not found" },
          _links: {
            self: { href: selfUrl },
            album: { href: albumUrl },
            albums: { href: `${baseV1Url}/albums` },
            characters: { href: `${baseV1Url}/characters` },
          },
        },
        { status: 404 },
      );
    }

    const parsedCharacters = z.array(CharacterSchema).parse(data);

    const _links = {
      self: {
        href: `${request.nextUrl.origin}/api/v1/albums/${id}/characters`,
      },
    };

    const baseUrl = `${request.nextUrl.origin}/api/v1/characters`;
    const charactersWithLinks = parsedCharacters.map((character) => ({
      ...character,
      _links: {
        self: { href: `${baseUrl}/${character.id}` },
      },
    }));

    const responseBody = {
      _links,
      characters: charactersWithLinks,
      totalCount: parsedCharacters.length,
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/hal+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "X-Total-Count": parsedCharacters.length.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

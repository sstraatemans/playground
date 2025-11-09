import { trpcClient } from "@/utils/trpcClient";
import { ArtistSchema } from "@sw/s_w_trpcserver";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/artists/{id}:
 *   get:
 *     summary: Get an artist by ID
 *     description: |
 *       Returns a single artist by ID following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getArtistById
 *     tags:
 *       - Artists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The artist ID
 *     responses:
 *       200:
 *         description: Successful response – single artist resource
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *             examples:
 *               default:
 *                 summary: Example artist
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/artists/1" }
 *                     collection: { href: "/api/v1/artists" }
 *                   id: 1
 *                   title: "Willy Vandersteen"
 *       404:
 *         description: Artist not found
 *         content:
 *           application/hal+json:
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Artist not found"
 *               _links:
 *                 self: { href: "/api/v1/artists/1" }
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
        error: { code: "BAD_REQUEST", message: "Invalid artist ID" },
        _links: { self: { href: pathname } },
      },
      { status: 400 },
    );
  }

  try {
    const data = await trpcClient.artists.getArtistById.query(id);

    if (!data) {
      const selfUrl = `${request.nextUrl.origin}/api/v1/artists/${id}`;
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Artist not found" },
          _links: { self: { href: selfUrl } },
        },
        { status: 404 },
      );
    }

    const parsedArtist = ArtistSchema.parse(data);

    const baseUrl = `${request.nextUrl.origin}/api/v1/artists`;
    const selfUrl = `${baseUrl}/${parsedArtist.id}`;

    const _links = {
      self: { href: selfUrl },
      collection: { href: baseUrl },
    };

    const artistWithLinks = {
      ...parsedArtist,
      _links,
    };

    return NextResponse.json(artistWithLinks, {
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

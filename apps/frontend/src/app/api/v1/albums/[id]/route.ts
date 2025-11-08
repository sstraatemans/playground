import { trpcClient } from "@/utils/trpcClient";
import { AlbumSchema } from "@sw/s_w_trpcserver";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/albums/{id}:
 *   get:
 *     summary: Get an album by ID
 *     description: |
 *       Returns a single album by ID following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getAlbumById
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
 *         description: Successful response – single album resource
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
 *             examples:
 *               default:
 *                 summary: Example album
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/albums/67" }
 *                     collection: { href: "/api/v1/albums" }
 *                   id: 67
 *                   title: "Jeromba de Griek"
 *                   date: "1965-10-11"
 *       404:
 *         description: Album not found
 *         content:
 *           application/hal+json:
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Album not found"
 *               _links:
 *                 self: { href: "/api/v1/albums/67" }
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
        error: { code: "BAD_REQUEST", message: "Invalid album ID" },
        _links: { self: { href: pathname } },
      },
      { status: 400 },
    );
  }

  try {
    const data = await trpcClient.albums.getAlbumById.query(id);

    if (!data) {
      const selfUrl = `${request.nextUrl.origin}/api/v1/albums/${id}`;
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Album not found" },
          _links: { self: { href: selfUrl } },
        },
        { status: 404 },
      );
    }

    const parsedAlbum = AlbumSchema.parse(data);

    const baseUrl = `${request.nextUrl.origin}/api/v1/albums`;
    const selfUrl = `${baseUrl}/${parsedAlbum.id}`;

    const _links = {
      self: { href: selfUrl },
      collection: { href: baseUrl },
    };

    const albumWithLinks = {
      ...parsedAlbum,
      _links,
    };

    return NextResponse.json(albumWithLinks, {
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

import { trpcClient } from "@/utils/trpcClient";
import { AlbumSchema } from "@sw/s_w_trpcserver";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/albums/[id]:
 *   get:
 *     summary: Get an album by ID
 *     description: |
 *       Returns an album by id following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation (next/prev/first/last).
 *     operationId: getAlbumById
 *     tags:
 *       - Album
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: id of the album to retrieve
 *     responses:
 *       200:
 *         description: Successful response – album by id
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
 *             examples:
 *               default:
 *                 summary: Example with 2 albums
 *                 value:
 *                   id: 67
 *                   title: "Jeromba de Griek"
 *                   date: "1965-10-11"
 *                   _links:
 *                     self: { href: "/api/v1/albums/67" }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Album not found" },
        _links: { self: { href: new URL(request.url).pathname } },
      },
      { status: 404 },
    );
  }

  try {
    const data = await trpcClient.albums.getAlbumById.query(id);
    console.log(data);

    if (!data) {
      return NextResponse.json(
        {
          error: { code: "BAD_REQUEST", message: "Album not found" },
          _links: { self: { href: new URL(request.url).pathname } },
        },
        { status: 404 },
      );
    }

    const parsedAlbum = AlbumSchema.parse(data);
    const baseUrl = `${request.nextUrl.origin}/api/v1/albums`;
    const selfUrl = `${baseUrl}/${parsedAlbum.id}`;

    const _links = {
      self: { href: selfUrl },
    };

    const responseBody = {
      _links,
      parsedAlbum,
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/hal+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    return Response.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

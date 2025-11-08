import { trpcClient } from "@/utils/trpcClient";
import { AlbumSchema } from "@sw/s_w_trpcserver";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import z from "zod";

/**
 * @swagger
 * /api/v1/albums:
 *   get:
 *     summary: Get paginated albums
 *     description: |
 *       Returns a paginated collection of albums following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation (next/prev/first/last).
 *     operationId: getAlbums
 *     tags:
 *       - Albums
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
 *         description: Successful response – paginated album collection
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/AlbumCollection'
 *             examples:
 *               default:
 *                 summary: Example with 2 albums
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/albums?limit=50&offset=0" }
 *                     next: { href: "/api/v1/albums?limit=50&offset=50" }
 *                     prev: { href: "/api/v1/albums?limit=50&offset=0" }
 *                     first: { href: "/api/v1/albums?limit=50&offset=0" }
 *                     last: { href: "/api/v1/albums?limit=50&offset=950" }
 *                     collection: { href: "/api/v1/albums" }
 *                   albums:
 *                     - id: 67
 *                       title: "Jeromba de Griek"
 *                       date: "1965-10-11"
 *                       _links:
 *                         self: { href: "/api/v1/albums/67" }
 *                   totalCount: 1234
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
    const { data, totalCount } = await trpcClient.albums.all.query({
      limit,
      offset,
    });

    const parsedAlbums = z.array(AlbumSchema).parse(data);
    const baseUrl = `${request.nextUrl.origin}/api/v1/albums`;
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

    const albumsWithLinks = parsedAlbums.map((album) => ({
      ...album,
      _links: {
        self: { href: `${baseUrl}/${album.id}` },
      },
    }));

    const responseBody = {
      _links,
      albums: albumsWithLinks,
      totalCount,
      page: { limit, offset, returned: parsedAlbums.length },
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
    return Response.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

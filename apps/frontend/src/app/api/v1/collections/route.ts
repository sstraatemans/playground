import { trpcClient } from "@/utils/trpcClient";
import { CollectionSchema } from "@sstraatemans/sw_trpcclient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import z from "zod";

/**
 * @swagger
 * /api/v1/collections:
 *   get:
 *     summary: Get paginated collections
 *     description: |
 *       Returns a paginated collection of comic collections following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation (next/prev/first/last).
 *     operationId: getCollections
 *     tags:
 *       - Collections
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
 *         description: Successful response – paginated collection of collections
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionCollection'
 *             examples:
 *               default:
 *                 summary: Example with 2 collections
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/collections?limit=50&offset=0" }
 *                     next: { href: "/api/v1/collections?limit=50&offset=50" }
 *                     prev: { href: "/api/v1/collections?limit=50&offset=0" }
 *                     first: { href: "/api/v1/collections?limit=50&offset=0" }
 *                     last: { href: "/api/v1/collections?limit=50&offset=950" }
 *                     collection: { href: "/api/v1/collections" }
 *                   collections:
 *                     - id: "VK"
 *                       name: "Vierkleurenreeks"
 *                       startYear: 1967
 *                       endYear: null
 *                       _links:
 *                         self: { href: "/api/v1/collections/VK" }
 *                     - id: "BK"
 *                       name: "Blauwe Klassiek reeks"
 *                       startYear: 1993
 *                       endYear: 1997
 *                       _links:
 *                         self: { href: "/api/v1/collections/BK" }
 *                   totalCount: 2
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
    const { data, totalCount } = await trpcClient.collections.all.query({
      limit,
      offset,
    });

    const parsedCollections = z.array(CollectionSchema).parse(data);
    const baseUrl = `${request.nextUrl.origin}/api/v1/collections`;
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

    const collectionsWithLinks = parsedCollections.map((collection) => ({
      ...collection,
      _links: {
        self: { href: `${baseUrl}/${collection.id}` },
      },
    }));

    const responseBody = {
      _links,
      collections: collectionsWithLinks,
      totalCount,
      page: {
        limit,
        offset,
        returned: parsedCollections.length, // ← FIXED: was totalCount
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
      // ← FIXED: was Response.json
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

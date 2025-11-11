import { trpcClient } from "@/utils/trpcClient";
import { CollectionSchema } from "@straatemans/sw_trpcclient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/collections/{id}:
 *   get:
 *     summary: Get a collection by ID
 *     description: |
 *       Returns a single collection by ID following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getCollectionById
 *     tags:
 *       - Collections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *     responses:
 *       200:
 *         description: Successful response – single collection resource
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *             examples:
 *               default:
 *                 summary: Example collection
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/collections/VK" }
 *                     collections: { href: "/api/v1/collections" }
 *                   id: "VK"
 *                   title: "Vierkleurenreeks"
 *                   startYear: 1967
 *                   endYear: null
 *                   wikiURL: "https://nl.wikipedia.org/wiki/Vierkleurenreeks"
 *       404:
 *         description: Collection not found
 *         content:
 *           application/hal+json:
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Collection not found"
 *               _links:
 *                 self: { href: "/api/v1/collections/VK" }
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
  const id = resolvedParams.id;

  // Validation: must be a positive integer
  if (!id) {
    const pathname = new URL(request.url).pathname;
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Invalid collection ID" },
        _links: { self: { href: pathname } },
      },
      { status: 400 },
    );
  }

  try {
    const data = await trpcClient.collections.getCollectionById.query(id);

    if (!data) {
      const selfUrl = `${request.nextUrl.origin}/api/v1/collections/${id}`;
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Collection not found" },
          _links: { self: { href: selfUrl } },
        },
        { status: 404 },
      );
    }

    const parsedCollection = CollectionSchema.parse(data);

    const baseUrl = `${request.nextUrl.origin}/api/v1/collections`;
    const selfUrl = `${baseUrl}/${parsedCollection.id}`;

    const _links = {
      self: { href: selfUrl },
      collections: { href: `${selfUrl}/collections` },
    };

    const collectionWithLinks = {
      ...parsedCollection,
      _links,
    };

    return NextResponse.json(collectionWithLinks, {
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

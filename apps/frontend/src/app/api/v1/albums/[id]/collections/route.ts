import { trpcClient } from "@/utils/trpcClient";
import { CollectionAlbumSchema } from "@sw/trpcclient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import z from "zod";

/**
 * @swagger
 * /api/v1/albums/{id}/collections:
 *   get:
 *     summary: Get all collections that include a specific album.
 *     description: |
 *       Returns an array of collections that include a specific album following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getAlbumCollections
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
 *         description: Successful response – array of collections that include the album
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionCollection'
 *             examples:
 *               default:
 *                 summary: Example with 2 collections
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/albums/67/collections" }
 *                     album: { href: "/api/v1/albums/67" }
 *                     albums: { href: "/api/v1/albums" }
 *                     collections: { href: "/api/v1/collections" }
 *                   collections:
 *                     - id: "BK"
 *                       name: "Blauwe Klassiek reeks"
 *                       _links:
 *                         self: { href: "/api/v1/collections/BK" }
 *                     - id: "VK"
 *                       name: "Vierkleurenreeks"
 *                       _links:
 *                         self: { href: "/api/v1/collections/VK" }
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
 *                 self: { href: "/api/v1/albums/67/collections" }
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
  const selfUrl = `${albumUrl}/${id}/collections`;

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
    const data = await trpcClient.albums.getAlbumCollectionsById.query(id);
    console.log("Fetched collections data:", data);

    if (!data) {
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Album not found" },
          _links: {
            self: { href: selfUrl },
            album: { href: albumUrl },
            albums: { href: `${baseV1Url}/albums` },
            collections: { href: `${baseV1Url}/collections` },
          },
        },
        { status: 404 },
      );
    }

    const parsedCollections = z.array(CollectionAlbumSchema).parse(data);

    const _links = {
      self: {
        href: `${request.nextUrl.origin}/api/v1/albums/${id}/collections`,
      },
    };

    const baseUrl = `${request.nextUrl.origin}/api/v1/collections`;
    const collectionsWithLinks = parsedCollections.map((collection) => ({
      ...collection,
      _links: {
        self: { href: `${baseUrl}/${collection.collectionId}` },
      },
    }));

    const responseBody = {
      _links,
      collections: collectionsWithLinks,
      totalCount: parsedCollections.length,
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/hal+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "X-Total-Count": parsedCollections.length.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

import { trpcClient } from "@/utils/trpcClient";
import { AlbumSchema } from "@straatemans/sw_trpcclient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import z from "zod";

/**
 * @swagger
 * /api/v1/artists/{id}/albums:
 *   get:
 *     summary: Get all albums from an artist by artistId
 *     description: |
 *       Returns an array of albums of an artist following HAL+JSON conventions.
 *       Clients **must** follow `_links` for navigation.
 *     operationId: getArtistAlbums
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
 *         description: Successful response – array of albums of an artist
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: '#/components/schemas/AlbumArtistCollection'
 *             examples:
 *               default:
 *                 summary: Example with 2 albums
 *                 value:
 *                   _links:
 *                     self: { href: "/api/v1/artists/1/albums" }
 *                     character: { href: "/api/v1/artists/1" }
 *                     albums: { href: "/api/v1/albums" }
 *                   albums:
 *                     - id: 67
 *                       title: "Jeromba de Griek"
 *                       date: "1965-10-11"
 *                       _links:
 *                         self: { href: "/api/v1/albums/67" }
 *                     - id: 68
 *                       title: "De sprietatoom"
 *                       date: "1946-05-15"
 *                       _links:
 *                         self: { href: "/api/v1/albums/68" }
 *                   totalCount: 2
 *       404:
 *         description: Artist not found
 *         content:
 *           application/hal+json:
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Artist not found"
 *               _links:
 *                 self: { href: "/api/v1/artists/1/albums" }
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
  const artistUrl = `${baseV1Url}/artists/${id}`;
  const selfUrl = `${artistUrl}/albums`;

  // Validation: must be a positive integer
  if (!rawId || isNaN(id) || id < 1) {
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Invalid artist ID" },
        _links: { self: { href: selfUrl } },
      },
      { status: 400 },
    );
  }

  try {
    const data = await trpcClient.artists.getArtistAlbumsById.query(id);

    if (!data) {
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "Artist not found" },
          _links: {
            self: { href: selfUrl },
            album: { href: artistUrl },
            albums: { href: `${baseV1Url}/albums` },
          },
        },
        { status: 404 },
      );
    }

    const parsedAlbums = z.array(AlbumSchema).parse(data);

    const _links = {
      self: {
        href: `${request.nextUrl.origin}/api/v1/artists/${id}/albums`,
      },
    };

    const baseUrl = `${request.nextUrl.origin}/api/v1/albums`;
    const albumsWithLinks = parsedAlbums.map((album) => ({
      ...album,
      _links: {
        self: { href: `${baseUrl}/${album.id}` },
      },
    }));

    const responseBody = {
      _links,
      albums: albumsWithLinks,
      totalCount: parsedAlbums.length,
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/hal+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "X-Total-Count": parsedAlbums.length.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

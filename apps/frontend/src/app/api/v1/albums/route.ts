import { trpcClient } from "@/utils/trpcClient";

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Returns a list of all albums
 *     description: A simple endpoint to test the API.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 */
export async function GET() {
  try {
    const data = await trpcClient.albums.all.query();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: "Error fetching data", error },
      { status: 500 },
    );
  }
}

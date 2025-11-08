/**
 * @swagger
 * components:
 *   schemas:
 *     Links:
 *       type: object
 *       additionalProperties:
 *         type: object
 *         properties:
 *           href:
 *             type: string
 *             format: uri
 *         required:
 *           - href
 *       description: HAL link object (RFC 5988)
 *
 *
 *     Album:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - date
 *         - _links
 *       properties:
 *         id:
 *           type: integer
 *           example: 67
 *         title:
 *           type: string
 *           example: "Summer Vibes"
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-06-15"
 *         scenarioArtistId:
 *           type: integer
 *           nullable: true
 *         drawArtistId:
 *           type: integer
 *           nullable: true
 *         wikiURL:
 *           type: string
 *           format: uri
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *           format: uri
 *           nullable: true
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *
 *
 *     AlbumCollection:
 *       type: object
 *       required:
 *         - _links
 *         - albums
 *         - totalCount
 *         - page
 *       properties:
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *         albums:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Album'
 *         totalCount:
 *           type: integer
 *           minimum: 0
 *           example: 1234
 *         page:
 *           type: object
 *           required:
 *             - limit
 *             - offset
 *             - returned
 *           properties:
 *             limit:
 *               type: integer
 *               minimum: 1
 *               maximum: 100
 *             offset:
 *               type: integer
 *               minimum: 0
 *             returned:
 *               type: integer
 *               minimum: 0
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid request parameters
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: BAD_REQUEST
 *                   message:
 *                     type: string
 *                     example: Invalid pagination
 *               _links:
 *                 $ref: '#/components/schemas/Links'
 *           example:
 *             error:
 *               code: BAD_REQUEST
 *               message: Invalid pagination
 *             _links:
 *               self:
 *                 href: /api/v1/albums
 *
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             required:
 *               - message
 */

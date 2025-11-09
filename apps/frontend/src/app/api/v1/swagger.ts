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
 *           templated:
 *             type: boolean
 *             default: false
 *         required:
 *           - href
 *       description: HAL link object (RFC 5988)
 *       example:
 *         self:
 *           href: /api/v1/albums/67
 *         next:
 *           href: /api/v1/albums?offset=20&limit=20
 *         collection:
 *           href: /api/v1/albums
 *
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: object
 *           required:
 *             - code
 *             - message
 *           properties:
 *             code:
 *               type: string
 *               example: BAD_REQUEST
 *             message:
 *               type: string
 *               example: Invalid pagination parameters
 *         _links:
 *           $ref: '#/components/schemas/Links'
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
 *               example: 20
 *             offset:
 *               type: integer
 *               minimum: 0
 *               example: 0
 *             returned:
 *               type: integer
 *               minimum: 0
 *               example: 20
 *
 *     Artist:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: "John Doe"
 *         wikiURL:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://en.wikipedia.org/wiki/John_Doe"
 *         image:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/artists/12.jpg"
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *
 *     ArtistCollection:
 *       type: object
 *       required:
 *         - _links
 *         - artists
 *         - totalCount
 *         - page
 *       properties:
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *         artists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Artist'
 *         totalCount:
 *           type: integer
 *           minimum: 0
 *           example: 567
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
 *               example: 20
 *             offset:
 *               type: integer
 *               minimum: 0
 *               example: 0
 *             returned:
 *               type: integer
 *               minimum: 0
 *               example: 20
 *
 *     Character:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - years
 *         - albumsTemp
 *       properties:
 *         id:
 *           type: integer
 *           example: 89
 *         name:
 *           type: string
 *           example: "Captain Thunder"
 *         description:
 *           type: string
 *           example: "A superhero from the 1980s comic series."
 *         years:
 *           type: string
 *           example: "1985-1992"
 *         albumsTemp:
 *           type: string
 *           example: "67,68,70"
 *         wikiURL:
 *           type: string
 *           format: uri
 *           nullable: true
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *
 *     CharacterCollection:
 *       type: object
 *       required:
 *         - _links
 *         - characters
 *         - totalCount
 *         - page
 *       properties:
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *         characters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Character'
 *         totalCount:
 *           type: integer
 *           minimum: 0
 *           example: 342
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
 *     Collection:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - startYear
 *         - endYear
 *       properties:
 *         id:
 *           type: string
 *           example: "summer-2024"
 *         name:
 *           type: string
 *           example: "Summer Specials"
 *         startYear:
 *           type: string
 *           example: "2024"
 *         endYear:
 *           type: string
 *           example: "2024"
 *         wikiURL:
 *           type: string
 *           format: uri
 *           nullable: true
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *
 *     CollectionCollection:
 *       type: object
 *       required:
 *         - _links
 *         - collections
 *         - totalCount
 *         - page
 *       properties:
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *         collections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Collection'
 *         totalCount:
 *           type: integer
 *           minimum: 0
 *           example: 89
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
 *     CollectionAlbum:
 *       type: object
 *       required:
 *         - albumId
 *         - collectionId
 *         - number
 *         - _links
 *       properties:
 *         albumId:
 *           type: integer
 *           description: ID of the album in this collection
 *           example: 67
 *         collectionId:
 *           type: string
 *           description: ID of the collection
 *           example: "summer-2024"
 *         number:
 *           type: integer
 *           description: Position/order of the album in the collection
 *           example: 5
 *         image:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: Optional override image for this album in the collection
 *           example: "https://example.com/collections/summer-2024/album-67.jpg"
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *       example:
 *         albumId: 67
 *         collectionId: "summer-2024"
 *         number: 5
 *         image: "https://example.com/collections/summer-2024/album-67.jpg"
 *         _links:
 *           self:
 *             href: /api/v1/collections/summer-2024/albums/67
 *           album:
 *             href: /api/v1/albums/67
 *           collection:
 *             href: /api/v1/collections/summer-2024
 *
 *     CollectionAlbumCollection:
 *       type: object
 *       required:
 *         - _links
 *         - items
 *         - totalCount
 *         - page
 *       properties:
 *         _links:
 *           $ref: '#/components/schemas/Links'
 *         items:
 *           type: array
 *           description: List of CollectionAlbum entries (albums in a specific collection or all links)
 *           items:
 *             $ref: '#/components/schemas/CollectionAlbum'
 *         totalCount:
 *           type: integer
 *           minimum: 0
 *           example: 42
 *         page:
 *           $ref: '#/components/schemas/AlbumCollection/properties/page'
 *       example:
 *         _links:
 *           self:
 *             href: /api/v1/collections/summer-2024/albums?limit=20&offset=0
 *           collection:
 *             href: /api/v1/collections/summer-2024
 *         items:
 *           - albumId: 67
 *             collectionId: "summer-2024"
 *             number: 1
 *             image: null
 *           - albumId: 68
 *             collectionId: "summer-2024"
 *             number: 2
 *             image: "https://example.com/custom-cover.jpg"
 *         totalCount: 42
 *         page:
 *           limit: 20
 *           offset: 0
 *           returned: 20
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid request parameters
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error:
 *               code: BAD_REQUEST
 *               message: Invalid pagination - offset must be >= 0
 *             _links:
 *               self:
 *                 href: /api/v1/albums
 *
 *     Unauthorized:
 *       description: Authentication required
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error:
 *               code: UNAUTHORIZED
 *               message: Access token is missing or invalid
 *
 *     Forbidden:
 *       description: Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error:
 *               code: FORBIDDEN
 *               message: You do not have permission to access this resource
 *
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error:
 *               code: NOT_FOUND
 *               message: Album with id 999 not found
 *             _links:
 *               collection:
 *                 href: /api/v1/albums
 *
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error:
 *               code: INTERNAL_SERVER_ERROR
 *               message: Something went wrong on the server
 */

// the code to update an album's details
import type { FastifyRequest, FastifyReply } from 'fastify';
import { getAlbumsJson } from 'server/utils/getAlbumsJson.js';

export interface AlbumParams {
  albumId: number; // Or number, if you constrain it to digits
}

export const updateAlbumHandler = async (
  request: FastifyRequest<{ Params: AlbumParams }>,
  reply: FastifyReply
) => {
  const albumId = request.params?.albumId;

  const albumsJSON = await getAlbumsJson();

  return reply.send(albumsJSON);
};

// the code to update an album's details
import type { FastifyRequest, FastifyReply } from 'fastify';

export interface AlbumParams {
  albumId: number; // Or number, if you constrain it to digits
}

export const updateAlbumHandler = async (
  request: FastifyRequest<{ Params: AlbumParams }>,
  reply: FastifyReply
) => {
  const albumId = request.params?.albumId;

  console.log({ albumId });

  return reply.send({ status: 'Update received', albumId });
};

import type { Album } from '@prisma/client';

export const getAlbumTool = {
  type: 'function',
  function: {
    name: 'get_album_data',
    description:
      'Retrieve album data from Wikipedia page based on the album title.',
    parameters: {
      type: 'object',
      properties: {
        albumTitle: {
          type: 'string',
          description: 'The title of the album.',
        },
      },
      required: ['albumTitle'],
    },
  },
} as const;

export const getAlbumData =
  (album: Album) => async (args: { albumTitle: string }) => {
    const { albumTitle } = args;

    if (!album.wikiURL) return album.title;

    const response = await fetch(album.wikiURL, {
      method: 'GET',
      headers: {
        'User-Agent':
          'suskeenwiskeapi/1.0 (https://yourwebsite.com/contact; your.email@example.com)', // Customize this
        Accept: 'text/html', // Use 'Accept' instead of 'Content-Type' for GET requests
        'Accept-Encoding': 'gzip',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch album data for ${albumTitle}`);
    }

    const pageContent = await response.text();
    return pageContent;
  };

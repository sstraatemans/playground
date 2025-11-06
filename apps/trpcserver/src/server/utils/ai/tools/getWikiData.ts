export const getWikiDataTool = {
  type: 'function',
  function: {
    name: 'get_wiki_data',
    description:
      'Retrieve album or character data from Wikipedia page based on the album title or character name.',
    parameters: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          description: 'The title of the album or the name of the character .',
        },
      },
      required: ['value'],
    },
  },
} as const;

export const getWikiData =
  (link?: string | null) => async (args: { value: string }) => {
    const { value } = args;

    if (!link) return '';

    const response = await fetch(link, {
      method: 'GET',
      headers: {
        'User-Agent':
          'suskeenwiskeapi/1.0 (https://yourwebsite.com/contact; your.email@example.com)', // Customize this
        Accept: 'text/html', // Use 'Accept' instead of 'Content-Type' for GET requests
        'Accept-Encoding': 'gzip',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${value}`);
    }

    const pageContent = await response.text();
    return pageContent;
  };

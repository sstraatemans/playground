// the code to update an album's details
import type OpenAI from 'openai';
import {
  getWikiDataTool,
  getWikiData,
} from 'server/utils/ai/tools/getWikiData.js';
import { callOpenAI } from 'server/utils/callOpenAI.js';
import { downloadAlbumImages } from 'server/utils/downloadAlbumImages.js';
import { findArtistByName } from 'server/utils/findArtistByName.js';
import { prisma } from '../../db/client.js';

export interface AlbumParams {
  albumId: number; // Or number, if you constrain it to digits
}

export const updateAlbumHandler = async (albumId?: number) => {
  if (!albumId) {
    throw new Error('No albumId provided');
  }

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: {
      ScenarioArtist: true,
      DrawArtist: true,
    },
  });

  if (!album) {
    throw new Error(`Album with id ${albumId} not found`);
  }

  console.log(`Updating album: ${album.title} (ID: ${album.id})`);

  const jsonSchema = {
    type: 'json_schema',
    json_schema: {
      name: 'response',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          synopsis: { type: 'string' },
          scenarioArtist: { type: 'string' },
          drawArtist: { type: 'string' },
        },
        required: ['synopsis', 'scenarioArtist', 'drawArtist'],
        additionalProperties: false,
      },
    },
  };

  const userPrompt = `
    give a synopsis update for the suske en wiske album titled ${album.title}
    make it in correct Markdown format. make the synopsis in Dutch language.
    Do not add links or references to Wikipedia.
    Also return the names of the scenario and draw artists for this album.
    When there are multiple names for 1 field, take the first one (the top one).
    You will find the artists near "scenario" and "tekeningen" on the wiki page.
    When you cannot find the artist name, return NULL for that field.
  `;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are a specialized assistant in suske en wiske albums. You help update album details based on existing data. Always respond in JSON format conforming to the provided schema.',
    },
    { role: 'user', content: userPrompt },
  ];

  const tools = [
    {
      tool: getWikiDataTool,
      name: 'get_wiki_data',
      func: () => getWikiData(album.wikiURL),
    },
  ];

  const responseMessage = await callOpenAI({
    jsonSchema,
    messages,
    tools,
  });

  console.log('content', responseMessage.content);
  if (!responseMessage.content) {
    throw new Error('No content in response message');
  }
  const data = JSON.parse(responseMessage.content || '{}');

  const scenarioArtist = await findArtistByName(data.scenarioArtist);
  const drawArtist = await findArtistByName(data.drawArtist);

  await prisma.album.update({
    where: { id: album.id },
    data: {
      description: data.synopsis ?? '',
      scenarioArtistId: scenarioArtist?.id,
      drawArtistId: drawArtist?.id,
    },
  });
};

const main = async () => {
  await downloadAlbumImages();
  const albums = await prisma.album.findMany({ orderBy: { id: 'asc' } });

  for (const album of albums) {
    if (album.description || !album.wikiURL) {
      continue;
    }
    await updateAlbumHandler(album.id);
  }
};

main().catch(console.error);

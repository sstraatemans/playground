// the code to update an album's details
import type OpenAI from 'openai';
import { getAlbumData, getAlbumTool } from 'server/utils/ai/tools/getAlbum.js';
import { findArtistByName } from 'server/utils/findArtistByName.js';
import { prisma } from '../../db/client.js';
import { openai } from '../utils/ai/client.js';

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
  `;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are a specialized assistant in suske en wiske albums. You help update album details based on existing data. Always respond in JSON format conforming to the provided schema.',
    },
    { role: 'user', content: userPrompt },
  ];

  // Call OpenAI chat completion with tools
  let completion = await openai.chat.completions.create({
    model: 'gpt-4o', // Or whichever model you prefer
    messages,
    tools: [getAlbumTool],
    tool_choice: 'auto',
    response_format: jsonSchema as any,
  });

  let responseMessage = completion.choices[0].message;

  if (responseMessage.tool_calls) {
    messages.push(responseMessage); // Add assistant's message to history

    for (const toolCall of responseMessage.tool_calls) {
      if (
        toolCall.type === 'function' &&
        toolCall.function.name === 'get_album_data'
      ) {
        const args = JSON.parse(toolCall.function.arguments);
        console.log({ args });
        const albumData = await getAlbumData(album)(args);

        // Add tool result back to messages
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(albumData),
        });
      }
    }

    // Call OpenAI again with updated messages
    completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: [getAlbumTool],
      tool_choice: 'auto',
      response_format: jsonSchema as any,
    });

    responseMessage = completion.choices[0].message;
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
  const albumId = process.argv[2];
  await updateAlbumHandler(Number(albumId));
};

main().catch(console.error);

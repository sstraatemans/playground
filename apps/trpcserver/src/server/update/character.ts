// the code to update an character's details
import type OpenAI from 'openai';
import {
  getWikiDataTool,
  getWikiData,
} from 'server/utils/ai/tools/getWikiData.js';
import { callOpenAI } from 'server/utils/callOpenAI.js';
import { wait } from 'server/utils/wait.js';
import { prisma } from '../../db/client.js';

export const updateCharacterHandler = async (characterId?: number) => {
  if (!characterId) {
    throw new Error('No characterId provided');
  }

  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error(`Album with id ${character} not found`);
  }

  console.log(`Updating album: ${character.name} (ID: ${character.id})`);

  const jsonSchema = {
    type: 'json_schema',
    json_schema: {
      name: 'response',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          synopsis: { type: 'string' },
        },
        required: ['synopsis'],
        additionalProperties: false,
      },
    },
  };

  const userPrompt = `
    give a synopsis update for the suske en wiske character named ${character.name}
    make it in correct Markdown format. make the synopsis in Dutch language.
    Do not add links or references to Wikipedia.
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
      func: () => getWikiData(character.wikiURL),
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

  await prisma.character.update({
    where: { id: character.id },
    data: {
      description: data.synopsis ?? '',
    },
  });
};

const main = async () => {
  const characters = await prisma.character.findMany({
    orderBy: { id: 'asc' },
  });

  for (const character of characters) {
    if (character.description || !character.wikiURL) {
      continue;
    }
    await updateCharacterHandler(character.id);
    await wait(30000);
  }
};

main().catch(console.error);

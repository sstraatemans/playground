import type { Album, Character } from '@prisma/client';
import type OpenAI from 'openai';
import {
  getWikiData,
  getWikiDataTool,
} from 'server/utils/ai/tools/getWikiData.js';
import { callOpenAI } from 'server/utils/callOpenAI.js';
import { wait } from 'server/utils/wait.js';
import { prisma } from '../../db/client.js';

const updateAlbumCharactersViaAlbumPages = async (
  characters: Character[],
  album: Album
) => {
  const jsonSchema = {
    type: 'json_schema',
    json_schema: {
      name: 'response',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          characters: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                id: { type: 'number' },
              },
              required: ['name', 'id'],
              additionalProperties: false,
            },
          },
        },
        required: ['characters'],
        additionalProperties: false,
      },
    },
  };

  const cleanedCharacterNames = characters.map((character) => ({
    characterId: character.id,
    name: character.name,
  }));

  const tools = [
    {
      tool: getWikiDataTool,
      name: 'get_wiki_data',
      func: () => getWikiData(album.wikiURL),
    },
  ];

  const userPrompt = `
  Give a list of Suske en Wiske characters who appear in this album (${album.title}).
  Find all the album information. Then try to find the characters ("Personages") on the wiki page.
  For all the found characters, find the matching character from this list:
    ${JSON.stringify(cleanedCharacterNames)}. If no match is found, ignore that character.
  Return an array of objects with the character name and id.`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are a specialized assistant in suske en wiske albums. You help update album details based on existing data. Always respond in JSON format conforming to the provided schema.',
    },
    { role: 'user', content: userPrompt },
  ];

  const responseMessage = await callOpenAI({
    jsonSchema,
    messages,
    tools,
  });

  const { characters: linkedCharacters } = JSON.parse(
    responseMessage.content ?? '{}'
  ) as any;

  if (!linkedCharacters || linkedCharacters.length === 0) {
    console.log(`No characters found for album ${album.title}`);
    return;
  }

  console.log({
    linkedCharacters,
  });

  await prisma.$transaction(
    linkedCharacters.map((character: any) => {
      return prisma.albumCharacter.upsert({
        where: {
          albumId_characterId: {
            albumId: album.id,
            characterId: character.id,
          },
        },
        update: {},
        create: { albumId: album.id, characterId: character.id },
      });
    })
  );
};

export const updateAlbumCharacters = async (
  character: Character,
  albums: Album[]
) => {
  if (!character) {
    throw new Error('No character provided');
  }

  const jsonSchema = {
    type: 'json_schema',
    json_schema: {
      name: 'response',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          albums: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                id: { type: 'number' },
              },
              required: ['title', 'id'],
              additionalProperties: false,
            },
          },
        },
        required: ['albums'],
        additionalProperties: false,
      },
    },
  };

  const cleanedAlbumTitles = albums.map((album) => ({
    albumId: album.id,
    title: album.title,
  }));

  const userPrompt = `
  Give a list of Suske en Wiske albums in which this character (${character.name}) appears.
  To know in what albums this character appears we have the following info "${character.albumsTemp}".

  With this we should be able to find an array of the correct album titles from the following extensive list of albums:
${JSON.stringify(cleanedAlbumTitles)}
  `;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are a specialized assistant in suske en wiske albums. You help update album details based on existing data. Always respond in JSON format conforming to the provided schema.',
    },
    { role: 'user', content: userPrompt },
  ];

  const responseMessage = await callOpenAI({
    jsonSchema,
    messages,
    tools: [],
  });

  const { albums: linkedAlbums } = JSON.parse(
    responseMessage.content ?? '{}'
  ) as any;

  if (!linkedAlbums || linkedAlbums.length === 0) {
    console.log(`No albums found for character ${character.name}`);
    return;
  }

  await prisma.$transaction(
    linkedAlbums.map((album: any) => {
      return prisma.albumCharacter.upsert({
        where: {
          albumId_characterId: {
            albumId: album.id,
            characterId: character.id,
          },
        },
        update: {},
        create: { albumId: album.id, characterId: character.id },
      });
    })
  );

  await prisma.character.update({
    data: { albumsImported: true },
    where: { id: character.id },
  });
};

const main = async () => {
  const characters = await prisma.character.findMany({
    orderBy: { id: 'asc' },
  });

  const albums = await prisma.album.findMany({
    orderBy: { id: 'asc' },
  });

  for (const character of characters) {
    if (character.albumsImported) {
      continue;
    }

    console.log(
      `Processing character: ${character.name} ${character.albumsTemp}`
    );

    await updateAlbumCharacters(character, albums);

    await prisma.character.update({
      data: { albumsImported: true },
      where: { id: character.id },
    });
    await wait(10000);
  }

  for (const album of albums) {
    if (album.charactersImported) {
      continue;
    }
    console.log(`Processing album: ${album.title}`);
    await updateAlbumCharactersViaAlbumPages(characters, album);

    await prisma.album.update({
      data: { charactersImported: true },
      where: { id: album.id },
    });

    await wait(10000);
  }
};

main().catch(console.error);

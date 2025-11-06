import type { Character } from '@prisma/client';
import * as cheerio from 'cheerio';
import { tabletojson } from 'tabletojson';
import { createWikiURL } from './createWikiURL.js';

const WIKI_ALLCHARACTERS_URL =
  'https://nl.wikipedia.org/wiki/Lijst_van_personages_uit_Suske_en_Wiske';

export const getCharactersJson = async (): Promise<Character[]> => {
  const tables = await tabletojson.convertUrl(WIKI_ALLCHARACTERS_URL, {
    stripHtmlFromCells: false,
  });

  const table = tables[0];

  const convertedJson = table.map((row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      const $ = cheerio.load(value as string); // Cast to string if needed
      const text = $.text().trim();

      switch (key) {
        case 'Personage(s)':
          row['wikiURL'] = createWikiURL(value);
          row['name'] = text;
          delete row['Personage(s)'];
          return;

        case 'Eerste verschijnen':
          row['years'] = text;
          delete row['Eerste verschijnen'];
          return;

        case 'Voorkomen in albums':
          row['albumsTemp'] = text;
          delete row['Voorkomen in albums'];
          return;

        case 'Beschrijving':
          row['description'] = text;
          delete row['Beschrijving'];
          return;

        default:
          row[key] = text;
      }
    });

    return row;
  });

  return convertedJson;
};

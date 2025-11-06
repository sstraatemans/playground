import type { Character } from '@prisma/client';
import { tabletojson } from 'tabletojson';

const WIKI_ALLCHARACTERS_URL =
  'https://nl.wikipedia.org/wiki/Lijst_van_personages_uit_Suske_en_Wiske';

export const getCharactersJson = async (): Promise<Character[]> => {
  const tables = await tabletojson.convertUrl(WIKI_ALLCHARACTERS_URL, {
    stripHtmlFromCells: true,
  });

  const table = tables[0];

  const convertedJson = table.map((row: any) => {
    if (row['Personage(s)']) {
      row['name'] = row['Personage(s)'];
      delete row['Personage(s)'];
    }

    if (row['Eerste verschijnen']) {
      row['years'] = row['Eerste verschijnen'];
      delete row['Eerste verschijnen'];
    }

    if (row['Voorkomen in albums']) {
      row['albumsTemp'] = row['Voorkomen in albums'];
      delete row['Voorkomen in albums'];
    }
    if (row['Beschrijving']) {
      row['description'] = row['Beschrijving'];
      delete row['Beschrijving'];
    }

    return row;
  });

  return convertedJson;
};

import * as cheerio from 'cheerio';
import { tabletojson } from 'tabletojson';
import { createWikiURL } from './createWikiURL.js';
import series from './data/series.js';

const WIKI_ALLALBUMS_URL =
  'https://nl.wikipedia.org/wiki/Lijst_van_verhalen_van_Suske_en_Wiske';

type Id = (typeof series)[number]['id'];

export type WikiAlbum = {
  id: number;
  title: string;
  date: string;
  wikiURL?: string;
} & { [K in Id]: number };

export const getAlbumsJson = async (): Promise<WikiAlbum[]> => {
  const tables = await tabletojson.convertUrl(WIKI_ALLALBUMS_URL, {
    stripHtmlFromCells: false,
  });

  const table = tables[0];
  const convertedJson = table.map((row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      const $ = cheerio.load(value as string); // Cast to string if needed
      const text = $.text().trim();

      switch (key) {
        case 'Titel':
          row['wikiURL'] = createWikiURL(row['Titel']);
          row['title'] = text;
          delete row['Titel'];
          return;

        case 'Nr.':
          row['id'] = Number(text);
          delete row['Nr.'];
          return;

        case 'Datum':
          row['date'] = text;
          delete row['Datum'];
          return;

        default:
          row[key] = text;
      }
    });

    series.forEach((serie: any) => {
      if (!row[serie.id]) {
        delete row[serie.id];
      }
    });

    return row;
  });

  return convertedJson;
};

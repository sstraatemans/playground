import { tabletojson } from 'tabletojson';
import series from './data/series.js';

const WIKI_ALLALBUMS_URL =
  'https://nl.wikipedia.org/wiki/Lijst_van_verhalen_van_Suske_en_Wiske';

type Id = (typeof series)[number]['id'];

export type WikiAlbum = {
  id: number;
  title: string;
  date: string;
} & { [K in Id]: number };

export const getAlbumsJson = async (): Promise<WikiAlbum[]> => {
  const tables = await tabletojson.convertUrl(WIKI_ALLALBUMS_URL, {
    stripHtmlFromCells: true,
  });

  const table = tables[0];
  const convertedJson = table.map((row: any) => {
    if (row['Nr.']) {
      row['id'] = Number(row['Nr.']);
      delete row['Nr.'];
    }

    if (row['Titel']) {
      row['title'] = row['Titel'];
      delete row['Titel'];
    }

    if (row['Datum']) {
      row['date'] = row['Datum'];
      delete row['Datum'];
    }

    series.forEach((serie: any) => {
      if (!row[serie.id]) {
        delete row[serie.id];
      }
    });

    return row;
  });

  return convertedJson;
};

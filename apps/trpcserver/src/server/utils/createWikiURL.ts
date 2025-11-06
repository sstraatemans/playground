import * as cheerio from 'cheerio';

export const createWikiURL = (row: any) => {
  if (!row) return;
  // get the wikilink if present
  const $ = cheerio.load(row);
  const url = $('a').attr('href');
  if (url) {
    return `https://nl.wikipedia.org${url}`;
  }
};

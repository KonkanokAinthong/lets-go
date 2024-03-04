/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = await fetch('https://travel.trueid.net/travelguide');
  const html = await response.text();
  const $ = load(html);

  const locations = $('.global__ArticlVerticleItemtStyle-sc-10c7lju-7.hXkjWF > article > div')
    .map((i, el) => {
      const $el = $(el);

      const title = $el.find('h3').text();
      const image = $el.find('img').attr('data-src');
      const link = $el.find('a').attr('href');

      return {
        title,
        image,
        link,
      };
    })
    .get()
    .slice(0, 10); // Limit to the first 10 items;

  return NextResponse.json({ locations });
}

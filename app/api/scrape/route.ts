/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = await fetch('https://www.kpopmap.com/kpopmap-trending/');
  const html = await response.text();
  const $ = load(html);

  const trending = $('div.trending-box.people > div.post');

  const trendingList = trending
    .map((_, el) => {
      const $el = $(el);
      const title = $el.find('div.post-data > h3 > a').text();
      const image = $el.find('div.post-img > a > img').attr('src');

      return {
        title,
        image,
      };
    })
    .get();

  return NextResponse.json({ trendingList });
}

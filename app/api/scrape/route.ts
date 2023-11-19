/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = await fetch('https://www.kpopmap.com/heart-top-100/');
  const html = await response.text();
  const $ = load(html);

  const trending = $('div.starrank_box.week.celebrity-profile');

  const trendingLists = trending
    .map((i, el) => {
      const $el = $(el);
      const titles = $el
        .find('p.name > a')
        .map((i, el) => $(el).text())
        .get();
      const images = $el
        .find('div.rank-img > img')
        .map((i, el) => $(el).attr('src'))
        .get();

      const data = titles.map((title, index) => ({
        title,
        image: images[index] || null,
      }));

      return data;
    })
    .get();

  return NextResponse.json({ trendingLists });
}

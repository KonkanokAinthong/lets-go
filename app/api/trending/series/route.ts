import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const countryParam = new URL(request.url).searchParams.get('nationality');
  const response = await fetch('https://mydramalist.com/stats/leaderboards/monthly');
  const html = await response.text();
  const $ = load(html);

  const series = $('li.fs-item');

  const trendingLists = series
    .map((i, el) => {
      const $el = $(el);
      const titles = $el
        .find('div.fs-details > div.details > a > b')
        .map((_, el1) => $(el1).text())
        .get();
      const images = $el
        .find('div.fs-details > a > img')
        .map((_, el2) => $(el2).attr('src'))
        .get();

      const nationality = $el.find('div.fs-details > div.details > div').text();

      const data = titles.map((title, index) => ({
        title,
        image: images[index] || null,
        nationality,
      }));

      return data;
    })
    .get();

  if (countryParam) {
    const filteredLists = trendingLists.filter((item) => item.nationality === countryParam);

    return NextResponse.json({ filteredLists });
  }

  return NextResponse.json({ trendingLists });
}

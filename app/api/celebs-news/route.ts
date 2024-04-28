import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch(
    'https://www.thairath.co.th/tags/%E0%B8%94%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%B5%E0%B8%A1%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2'
  );
  const html = await response.text();
  const $ = load(html);

  const news = $('.css-1vslxzv.e1jz6ffu8')
    .map((i, el) => {
      const $el = $(el);
      const title = $el.find('h2').text();
      const image = $el.find('img').attr('src');
      const link = $el.find('a').attr('href');

      return {
        title,
        image,
        link,
      };
    })
    .get();

  return NextResponse.json({ news });
}

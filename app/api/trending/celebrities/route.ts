/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const nationalityParam = new URL(request.url).searchParams.get('nationality');
    const response = await fetch('https://mydramalist.com/stats/leaderboards/monthly');
    const html = await response.text();
    const $ = load(html);

    const trending = $('li.fs-item');

    const trendingLists = trending
        .map((tredningListIndex, trendingListElement) => {
            const $el = $(trendingListElement);
            const titles = $el
                .find('div.fs-details > div.details > a > b')
                .map((titleElementIndex, titleElement) => $(titleElement).text())
                .get();

            const images = $el
                .find('div.fs-details > a > img')
                .map((imageIndex, imageElement) => $(imageElement).attr('src'))
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

    if (nationalityParam) {
        const filteredLists = trendingLists.filter((item) => item.nationality === nationalityParam);

        return NextResponse.json({ filteredLists });
    }

    return NextResponse.json({ trendingLists });
}

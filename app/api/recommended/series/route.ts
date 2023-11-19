/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const nationalityParam = new URL(request.url).searchParams.get('nationality');

    const response = await fetch('https://mydramalist.com/shows/top');
    const html = await response.text();
    const $ = load(html);

    const series = $('div.box');

    const seriesList = series
        .map((i, el) => {
            const $el = $(el);

            const titles = $el
                .find('h6.text-primary.title > a')
                .map((i, el) => $(el).text())
                .get()
                .filter((title) => title.trim().length > 0 && title !== '');
            const images = $el.find('img').map((i, el) => $(el).attr('data-src')).get();
            const description = $el.find('div > div > div.col-xs-9.row-cell.content > span').text();

            const data = titles.map((title, index) => ({
                title,
                image: images[index] || null,
                description,
            }));

            return data;
        })
        .get();

    if (nationalityParam) {
        const filteredLists = seriesList.filter((item) =>
            item.description.toLowerCase().includes(nationalityParam.toLowerCase())
        );
        return NextResponse.json(filteredLists);
    }

    return NextResponse.json(seriesList);
}

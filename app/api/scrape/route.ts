/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

import { scrollPageToBottom } from 'puppeteer-autoscroll-down';
import puppeteer from 'puppeteer-core';
import Chromium from '@sparticuz/chromium-min';
import celebrities from '../../../celebs.json';

function extractName(text: string) {
  const regex = /(?<=\().+?(?=\))/;
  const match = text.match(regex);
  return match ? match[0] : null;
}

function removePrefixes(list) {
  return list.map((item) => ({ ...item, name: item.name.replace(/^\d\.\)\s*/, '') }));
}

export async function GET(request: Request) {
  const nationalityParam = new URL(request.url).searchParams.get('nationality');

  const allData = [];
  const regex =
    /ถนนข้าวสาร|สวนลุมพินี|Dalmantian|ถนนเยาวราช|สนามแพทสเตเดี้ยม|centralwOrld|Parc Paragon/g;

  const browser = await puppeteer.launch({
    args: [...Chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: Chromium.defaultViewport,
    executablePath: await Chromium.executablePath('/opt/chromium'),
    headless: Chromium.headless as any,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 1000 });

  if (nationalityParam === 'Chinese') {
    await page.goto('https://entertainment.trueid.net/detail/oAKNDN8dQ8o2', {
      waitUntil: 'domcontentloaded',
    });

    // Scroll to the very top of the page
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    // Scroll to the bottom of the page with puppeteer-autoscroll-down
    await scrollPageToBottom(page, {
      size: 500,
    });

    await page.waitForSelector('[data-testid="lazyLoadContainer-div"]');

    const html = await page.content();
    const $ = load(html);

    const data = [];

    browser.close();

    $('[data-testid="lazyLoadContainer-div"]').each((index, element) => {
      const name = $(element).find('blockquote > p > strong').text();
      const description = $(element).find('p').text().trim();

      data.push({
        name,
        description,
      });
    });

    // Splitting the last item by numbering pattern (number followed by a dot)
    const lastItemParts = data[data.length - 1].name.split(/\d+\.\)/).filter(Boolean);

    // Removing the last item from the array
    data.pop(); // Remove the last item

    // Creating separate objects using map and pushing them to the array
    const splitObjects = lastItemParts.map((part) => ({
      name: part.trim(),
    }));

    // Concatenating the original data array with the split objects
    const updatedData = data.concat(splitObjects);

    const newData = removePrefixes(updatedData);

    return NextResponse.json(newData);
  }

  if (nationalityParam === 'Korean') {
    await page.goto('https://entertainment.trueid.net/detail/5gmRjj2Vp52a', {
      waitUntil: 'domcontentloaded',
    });

    // Scroll to the very top of the page
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    // Scroll to the bottom of the page with puppeteer-autoscroll-down
    await scrollPageToBottom(page, {
      size: 500,
    });

    await page.waitForSelector('._UtcWG');

    const html = await page.content();
    const $ = load(html);

    const data = [];

    browser.close();

    $('._3y5_T').each((index, element) => {
      const name = $(element).find('blockquote > p > strong').text();
      const description = $(element).find('p').text().trim();
      const places = description.match(regex);

      data.push({
        name,
        description,
        places: places ? places.map((place) => place.trim()) : null,
      });
    });

    // Splitting the last item by numbering pattern (number followed by a dot)
    const lastItemParts = data[data.length - 1].name.split(/\d+\.\)/).filter(Boolean);

    // Removing the last item from the array
    data.pop(); // Remove the last item

    // Creating separate objects using map and pushing them to the array
    const splitObjects = lastItemParts.map((part) => ({
      name: part.trim(),
    }));

    // Concatenating the original data array with the split objects
    const updatedData = data.concat(splitObjects);

    const cleanedData = updatedData.map((item) => {
      const name = item.name.replace(/^\d+\.\)\s*/, ''); // Remove the numbering pattern at the start of the string
      return { ...item, name: extractName(name) };
    });

    return NextResponse.json(cleanedData);
  }

  if (nationalityParam === 'Thai') {
    await page.goto(
      'https://www.mintmagth.com/people/offgun-taynew-beluca-huahin/?fbclid=IwAR1NNttw_jtkyLAcFCeMOyeYq_2d13NDmAVDqypV8sb4HWkJ7mUT9ukt7WU',
      {
        waitUntil: 'domcontentloaded',
      }
    );

    // Scroll to the very top of the page
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    // Scroll to the bottom of the page with puppeteer-autoscroll-down
    await scrollPageToBottom(page, {
      size: 500,
    });

    await page.waitForSelector('div.content-detail');

    const html = await page.content();
    const $ = load(html);

    const data = [...celebrities];

    $('._UtcWG').each((index, element) => {
      const name = $(element).find('strong').text();
      const placeVisited = $(element).find('._2R5zX').text();
      const image = $(element).find('img').attr('src');

      data.push({
        name,
        placeVisited,
        image,
      });
    });

    return NextResponse.json(data);
  }

  return NextResponse.json(allData);
}

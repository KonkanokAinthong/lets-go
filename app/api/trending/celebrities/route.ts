/* eslint-disable @typescript-eslint/no-unused-vars */

import Chromium from '@sparticuz/chromium-min';
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

import { scrollPageToBottom } from 'puppeteer-autoscroll-down';
import puppeteer from 'puppeteer-core';

export async function GET(request: Request) {
  const nationalityParam = new URL(request.url).searchParams.get('nationality');
  const browser = await puppeteer.launch({
    args: [...Chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: Chromium.defaultViewport,
    executablePath: await Chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/119.0.2/chromium-v119.0.2-pack.tar'
    ),
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

    await page.waitForSelector('._UtcWG');

    const html = await page.content();
    const $ = load(html);

    const data = [];

    const keywords = [
      'สวน',
      'ถนน',
      'วัด',
      'ตลาด',
      'ร้าน',
      'บาร์',
      'จังหวัด',
      'เมือง',
      'อำเภอ',
      'ตำบล',
      'Old Phuket Town',
      'ภูเก็ต',
      'กรุงเทพ',
      'ตลาดนัดจตุจักร',
      'ตลาดนัดอัมพวา',
      'ทะเลหัวหิน',
    ];

    $('._UtcWG').each((index, element) => {
      const name = $(element).find('blockquote > p > strong').text();
      const placeVisited = $(element).find('._2R5zX').text();
      const image = $(element).find('._2R5zX').text();

      data.push({
        name,
        placeVisited,
        image,
      });
    });

    console.log(data);
    return NextResponse.json(data);
  }

  if (nationalityParam === 'Korean') {
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

    await page.waitForSelector('._UtcWG');

    const html = await page.content();
    const $ = load(html);

    const data = [];

    const keywords = ['สวน', 'ถนน'];

    $('._UtcWG').each((index, element) => {
      const name = $(element).find('blockquote > p > strong').text();
      const placeVisited = $(element).find('._2R5zX').text();
      const image = $(element).find('._2R5zX').text();

      data.push({
        name,
        placeVisited,
        image,
      });
    });

    console.log(data);
    return NextResponse.json(data);
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

    const data = [];

    const keywords = ['หัวหิน'];

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

    console.log(data);
    return NextResponse.json(data);
  }

  browser.close();
}

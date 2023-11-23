/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';

export async function GET(request: Request) {
  const nationalityParam = new URL(request.url).searchParams.get('nationality');

  const browser = await puppeteer.launch({
    headless: 'new',
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

    await page.waitForSelector('._3y5_T');

    const html = await page.content();
    const $ = load(html);

    const data = [];

    const keywords = [
      'สวน',
      'ถนน',
      'หัวหิน',
      'เขา',
      'ทะเล',
      'ที่พัก',
      'ร้านอาหาร',
      'ร้านกาแฟ',
      'ภูเก็ต',
      'Phuket',
      'Old Phuket Town',
    ];
    browser.close();

    $('._3y5_T').each((index, element) => {
      const name = $(element).find('blockquote > p > strong').text();
      const description = $(element).find('p').text().trim();
      const containsKeyword = keywords.some(keyword => description.includes(keyword));
      data.push({
        name,
        description,
        containsKeyword,
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
      return { ...item, name };
    });

    console.log(cleanedData);

    return NextResponse.json(cleanedData);
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

    const cleanedData = updatedData.map((item) => {
      const name = item.name.replace(/^\d+\.\)\s*/, ''); // Remove the numbering pattern at the start of the string
      return { ...item, name };
    });

    console.log(cleanedData);

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

    const data = [];

    const keywords = ['หัวหิน'];

    $('._UtcWG').each((index, element) => {
      const name = $(element).find('strong').text();
      const placeVisited = $(element).find('._2R5zX').text();
      const image = $(element).find('img').attr('src');
      const ig = $(element).find('iframe').attr('src');

      data.push({
        name,
        placeVisited,
        image,
      });
    });

    console.log(data);
    return NextResponse.json(data);
  }
}

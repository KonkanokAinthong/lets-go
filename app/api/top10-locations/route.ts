/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from 'next/server';

const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');

export async function GET(request: Request) {
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar'
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto('https://travel.trueid.net/travelguide');

  // Scroll to the bottom of the page
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const { scrollHeight } = document.body;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve(true);
        }
      }, 100);
    });
  });

  // Wait for the lazy-loaded images to load
  await page.waitForSelector('.global__ArticlVerticleItemtStyle-sc-10c7lju-7.hXkjWF img[src]');

  const locations = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      '.global__ArticlVerticleItemtStyle-sc-10c7lju-7.hXkjWF > article > div'
    );
    return Array.from(elements)
      .slice(0, 10)
      .map((el) => {
        const title = el.querySelector('h3').textContent;
        const image = el.querySelector('img')?.src;
        const link = el.querySelector('a').href;

        return {
          title,
          image,
          link,
        };
      });
  });

  await browser.close();

  return NextResponse.json({ locations });
}

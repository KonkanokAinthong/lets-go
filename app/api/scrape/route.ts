/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

function wait(ms) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export async function GET(request: Request) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://entertainment.trueid.net/detail/5gmRjj2Vp52a', {
    waitUntil: 'networkidle0',
  });
  const nationalityParam = new URL(request.url).searchParams.get('nationality');

  // Get the height of the rendered page
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;

  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(20);
    viewportIncr = viewportIncr + viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await wait(200);

  try {
    // Regular expressions to identify Thai words
    const thaiWordRegex = /[\u0E00-\u0E7F]+/g;

    // Define the keywords related to places
    const keywords = ['สวน', 'ถนน'];

    // Wait for the lazy-loaded content to be visible
    await page.waitForSelector('._UtcWG');

    const celebrities = [
      {
        name: 'ซานซาน',
        placeVisited: 'สวนสนุก',
        image: 'https://mydramalist.com/images/actors/5.jpg',
      },
    ];

    const names = [];
    const descriptions = [];
    const placesVisiteds = [];
    const images = [];

    const extractedNames = await page.evaluate(() => {
      const container = document.querySelector('._UtcWG'); // Select the container element
      const blockquotes = container.querySelectorAll('blockquote'); // Select all <blockquote> elements
      const regex = /\d+\.\)\s*[\u0E00-\u0E7F]+\s*\(([\w\s]+)\)/g; // Regex pattern to match the desired text
      blockquotes.forEach((blockquote) => {
        const text = blockquote.textContent;
        const match = regex.exec(text); // Find matches using the regex pattern

        if (match) {
          const name = match[1]; // Extract the matched text
          names.push(name.trim()); // Push the name to the array after trimming whitespace
        }
      });

      const extractedParagraph = document.querySelector('._UtcWG').innerHTML;

      // Extract locations using regex matching
      const words = extractedParagraph.match(thaiWordRegex);

      if (words) {
        words.forEach((word, index) => {
          keywords.forEach((keyword) => {
            if (word.includes(keyword)) {
              placesVisiteds.push(word);
            }
          });
        });
      }

      return names; // Return the array of names
    });

    return NextResponse.json(extractedNames);
  } catch (error) {
    console.error('Error scraping data:', error);
  } finally {
    await browser.close();
  }
}

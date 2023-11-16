/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';

export async function GET(request: Request) {
  try {
    const url =
      'https://entertainment.trueid.net/detail/5gmRjj2Vp52a?fbclid=IwAR2VlZyovRUJ-uaw-lLlENgvrH4PrAHF5hxRrY0AT4-BVsWdK5tYQckF_Zs';

    // Fetch HTML content from the URL using fetch
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const html = await response.text();

    // Parse HTML using Cheerio
    const $ = load(html);

    // Extract data using Cheerio selectors

    // Return scraped data as JSON response
    return Response.json({ html });
  } catch (error) {
    Response.json({ error });
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const apiKey = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

    const latitude = 40.7128; // Replace with desired latitude
    const longitude = -74.006; // Replace with desired longitude

    const radius = 1500; // Specify the search radius in meters

    // limit 100 requests per day for free plan
    const searchText = 'Thai restaurants in Bangkok'; // Replace with your search query

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchText)}&key=${apiKey}`
    // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;

    const data = await fetch(url).then((res) => res.json());

    return NextResponse.json({ data });
}

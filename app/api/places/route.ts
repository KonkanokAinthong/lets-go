import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const place = new URL(request.url).searchParams.get('place');

    const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${API_KEY}`;

    const data = await fetch(url).then((res) => res.json());

    return NextResponse.json({ data });
}

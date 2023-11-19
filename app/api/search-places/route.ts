/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const place = new URL(request.url).searchParams.get('place');
    const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${place}&key=${API_KEY}`);

    const data = await response.json();

    return NextResponse.json({ data });
}

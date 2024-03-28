import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message, context } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content;
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}

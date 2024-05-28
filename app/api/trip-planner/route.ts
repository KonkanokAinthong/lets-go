import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { message, context } = await req.json();

  console.log('ข้อความจากผู้ใช้:', message);
  console.log('ข้อความจากระบบ:', context);

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: message },
      ],

      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content;

    console.log('คำตอบของ AI:', aiResponse);

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    // บันทึกข้อผิดพลาดและส่งกลับข้อความผิดพลาดเป็น JSON พร้อมสถานะ 500
    console.error('เกิดข้อผิดพลาดในการสร้างคำตอบของ AI:', error);
    return NextResponse.json({ error: 'ล้มเหลวในการสร้างคำตอบของ AI' }, { status: 500 });
  }
}

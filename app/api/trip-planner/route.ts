import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// สร้างอินสแตนซ์ของ OpenAI โดยใช้ API key จากตัวแปรสภาพแวดล้อม
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  // รับข้อความและบริบทจากร่างกายของคำขอ
  const { message, context } = await req.json();

  try {
    // สร้างคำขอ completion ไปยัง OpenAI chat API
    const completion = await openai.chat.completions.create({
      messages: [
        // กำหนดข้อความระบบ (system message) ด้วยบริบทที่ได้รับ
        { role: 'system', content: context },
        // กำหนดข้อความของผู้ใช้ (user message)
        { role: 'user', content: message },
      ],
      // ใช้โมเดล GPT-3.5 turbo
      model: 'gpt-3.5-turbo',
    });

    // รับคำตอบจาก AI จากทางเลือกแรกของการ completion
    const aiResponse = completion.choices[0].message.content;

    // ส่งกลับคำตอบของ AI เป็น JSON
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    // บันทึกข้อผิดพลาดและส่งกลับข้อความผิดพลาดเป็น JSON พร้อมสถานะ 500
    console.error('เกิดข้อผิดพลาดในการสร้างคำตอบของ AI:', error);
    return NextResponse.json({ error: 'ล้มเหลวในการสร้างคำตอบของ AI' }, { status: 500 });
  }
}

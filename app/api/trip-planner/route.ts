import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content;
    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// pages/api/trip-planner.ts

// import { NextApiRequest, NextApiResponse } from 'next';
// import { Configuration, OpenAIApi } from 'openai';
// import prisma from '../../lib/prisma';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { message } = req.body;

//     try {
//       // Retrieve famous places visited by celebrities from the database
//       const visitedPlaces = await prisma.visitedPlace.findMany({
//         include: {
//           celebrity: true,
//         },
//       });

//       // Format the visited places information for the AI prompt
//       const visitedPlacesInfo = visitedPlaces
//         .map(
//           (place) =>
//             `${place.celebrity.name} visited ${place.name} in ${place.location.lat}, ${place.location.lng} on ${place.date}.`
//         )
//         .join('\n');

//       const prompt = `You are a trip planner assistant specialized in recommending famous places visited by celebrities in Thailand. Use the following information to provide accurate and personalized trip suggestions:

// Famous places visited by celebrities:
// ${visitedPlacesInfo}

// User's message: ${message}
// `;

//       const completion = await openai.createChatCompletion({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//       });

//       const aiResponse = completion.data.choices[0].message.content;
//       return res.status(200).json({ response: aiResponse });
//     } catch (error) {
//       console.error('Error generating AI response:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }

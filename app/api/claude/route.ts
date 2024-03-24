import type { NextApiRequest, NextApiResponse } from 'next';

interface Celebrity {
  name: string;
  country: string;
  visitedPlaces: { lat: number; lng: number }[];
}

interface ClaudeResponse {
  answer: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ClaudeResponse>) {
  if (req.method === 'POST') {
    const { question, celebrities } = req.body;

    // Prepare the context for Claude based on the celebrities' visited places and nearby locations
    const context = celebrities
      .map(
        (celebrity: Celebrity) =>
          `${celebrity.name} from ${
            celebrity.country
          } visited the following places in Thailand: ${celebrity.visitedPlaces
            .map((place) => `(${place.lat}, ${place.lng})`)
            .join(', ')}`
      )
      .join('\n');

    // Make a request to the Claude API with the user's question and context
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.CLAUDE_API_KEY as string,
      },
      body: JSON.stringify({
        prompt: `${context}\n\nUser: ${question}\n\nAssistant:`,
        model: 'claude-v1',
        max_tokens_to_sample: 100,
      }),
    });

    const data = await response.json();
    const answer = data.completion;

    res.status(200).json({ answer });
  } else {
    res.status(405).json({ answer: 'Method not allowed' });
  }
}

// pages/api/trip-planner.ts
import { NextApiRequest, NextApiResponse } from 'next';

const CLAUDE_API_KEY = 'YOUR_CLAUDE_API_KEY';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { celebrity } = req.body;

  try {
    const prompt = `Generate a trip plan based on the following celebrity's visited places:\n\n${JSON.stringify(
      celebrity.visits
    )}\n\nTrip Plan:`;

    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
      },
      body: JSON.stringify({
        prompt,
        model: 'claude-v1',
        max_tokens_to_sample: 500,
      }),
    });

    const data = await response.json();
    const tripPlan = data.completion.trim();

    res.status(200).json({ tripPlan });
  } catch (error) {
    console.error('Error generating trip plan:', error);
    res.status(500).json({ error: 'Failed to generate trip plan' });
  }
}

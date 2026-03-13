import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages,
    });

    return Response.json({ text: result.text });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}

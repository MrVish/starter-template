import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { goal, budget, duration, audience } = await request.json();
    if (!goal || !budget || !duration || !audience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Simulate AI-generated campaign plan
    const steps = [
      `Define target audience: ${audience}`,
      `Allocate budget of ${budget} to the campaign`,
      `Set campaign duration to ${duration}`,
      `Craft messaging and creatives aligned with goal: ${goal}`,
      'Launch campaign across selected channels',
      'Monitor performance and optimize in real-time',
      'Compile insights and report ROI'
    ];
    const title = `AI-Driven Plan for: ${goal}`;
    return NextResponse.json({ title, steps }, { status: 200 });
  } catch (error) {
    console.error('AI Plans API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
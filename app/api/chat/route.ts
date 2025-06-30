import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();
  const reply = `Samantha says: ${message}`;
  return NextResponse.json({ response: reply });
}

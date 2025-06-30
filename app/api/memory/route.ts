import { NextResponse } from 'next/server';
import { messages } from '@/lib/data';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const results = messages.filter((m) => m.content.toLowerCase().includes(q));
  return NextResponse.json(results);
}

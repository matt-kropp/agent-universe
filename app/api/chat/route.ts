import { NextResponse } from 'next/server';
import { messages, Message } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { role, content } = await req.json();
  const reply: Message = {
    id: uuidv4(),
    role: 'assistant',
    content: `Echo: ${content}`,
    createdAt: Date.now(),
  };
  messages.push({ id: uuidv4(), role, content, createdAt: Date.now() });
  messages.push(reply);
  return NextResponse.json(reply);
}

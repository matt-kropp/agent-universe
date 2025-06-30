import { NextResponse } from 'next/server';
import { tasks } from '@/lib/data';

export async function POST(req, context) {
  const { status } = await req.json();
  const task = tasks.find((t) => t.id === context.params.id);
  if (task) {
    task.status = status;
  }
  return NextResponse.json(task || {});
}

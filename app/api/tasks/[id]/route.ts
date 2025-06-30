import { NextResponse } from 'next/server';
import { updateTask } from '@/lib/tasks';

export async function POST(
  request: Request,
  { params }: { params: any }
) {
  const { status } = await request.json();
  const updated = updateTask(params.id, status);
  return NextResponse.json({ task: updated });
}

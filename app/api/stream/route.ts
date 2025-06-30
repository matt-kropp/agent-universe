import { taskEmitter, Task } from '@/lib/tasks';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const encoder = new TextEncoder();

  function sendEvent(task: Task) {
    const data = `event: task_update\ndata: ${JSON.stringify(task)}\n\n`;
    writable.getWriter().write(encoder.encode(data));
  }

  taskEmitter.on('update', sendEvent);

  req.signal.addEventListener('abort', () => {
    taskEmitter.off('update', sendEvent);
    writable.getWriter().close();
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

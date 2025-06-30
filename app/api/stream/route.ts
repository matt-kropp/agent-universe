import { NextRequest } from 'next/server'
import { tasks } from '@/lib/data'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream()
  const encoder = new TextEncoder()
  const writer = writable.getWriter()

  const send = () => {
    const data = JSON.stringify({ tasks })
    writer.write(encoder.encode(`event: task_update\ndata: ${data}\n\n`))
  }

  const interval = setInterval(send, 3000)
  send()

  req.signal.addEventListener('abort', () => {
    clearInterval(interval)
    writer.close()
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

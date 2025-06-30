import { NextRequest } from 'next/server'
import { messages, Message } from '@/lib/data'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const userMsg: Message = { role: 'user', content: body.content || '' }
  messages.push(userMsg)
  const assistantReply: Message = {
    role: 'assistant',
    content: `Echo: ${userMsg.content}`,
  }
  messages.push(assistantReply)
  return Response.json({ message: assistantReply })
}

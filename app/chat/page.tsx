'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')

  const send = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'user', content: input }, data.message])
    setInput('')
  }

  return (
    <div>
      <Nav />
      <div className="p-4 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div key={i} className="p-2 border rounded">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input
            className="border flex-1 p-2"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button onClick={send} className="px-4 py-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [input, setInput] = useState('');

  async function sendMessage() {
    if (!input) return;
    const userMessage = { role: 'user', content: input };
    setMessages(m => [...m, userMessage]);
    setInput('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages(m => [...m, { role: 'assistant', content: data.response }]);
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <div className="flex flex-col gap-2 border p-4 rounded h-80 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'assistant' ? 'text-blue-600' : ''}>
            <strong>{m.role}: </strong>{m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Say something..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}

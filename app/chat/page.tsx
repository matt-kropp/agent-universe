'use client';
import { useEffect, useState, FormEvent } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: input }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: input },
      data,
    ]);
    setInput('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with Samantha</h1>
      <div className="space-y-2 mb-4">
        {messages.map((m) => (
          <div key={m.id} className="p-2 border rounded">
            <strong>{m.role}: </strong>
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="border rounded flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

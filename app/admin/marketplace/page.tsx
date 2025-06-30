'use client';
import { useState } from 'react';

export default function MarketplacePage() {
  const [installed, setInstalled] = useState<string[]>(['MarketResearch']);
  const [newAgent, setNewAgent] = useState('');

  const addAgent = () => {
    if (newAgent) {
      setInstalled((a) => [...a, newAgent]);
      setNewAgent('');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <ul className="mb-4 space-y-2">
        {installed.map((a) => (
          <li key={a} className="p-2 border rounded">
            {a}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={newAgent}
          onChange={(e) => setNewAgent(e.target.value)}
          className="border rounded flex-1 p-2"
          placeholder="New agent name"
        />
        <button
          onClick={addAgent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done';
}

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  const markDone = async (id: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: 'done' } : x)));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 border rounded flex justify-between">
            <span>
              {task.title} ({task.status})
            </span>
            {task.status !== 'done' && (
              <button
                onClick={() => markDone(task.id)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

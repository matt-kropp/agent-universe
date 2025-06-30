'use client';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  due?: string;
}

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.tasks));

    const es = new EventSource('/api/stream');
    es.addEventListener('task_update', e => {
      const task: Task = JSON.parse((e as MessageEvent).data);
      setTasks(t => t.map(tsk => (tsk.id === task.id ? task : tsk)));
    });
    return () => es.close();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/tasks/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Inbox</h2>
      <ul className="flex flex-col gap-2">
        {tasks.map(task => (
          <li key={task.id} className="border p-2 rounded flex justify-between">
            <div>
              <div>{task.title}</div>
              <small className="text-gray-500">{task.status}</small>
            </div>
            {task.status !== 'done' && (
              <button
                onClick={() => updateStatus(task.id, 'done')}
                className="text-sm bg-green-600 text-white px-2 py-1 rounded"
              >
                Mark Done
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

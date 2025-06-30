'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import { Task } from '@/lib/data'

export default function Inbox() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const es = new EventSource('/api/stream')
    es.onmessage = e => {
      const parsed = JSON.parse(e.data)
      setTasks(parsed.tasks)
    }
    return () => es.close()
  }, [])

  return (
    <div>
      <Nav />
      <div className="p-4">
        <h1 className="text-xl mb-2">Inbox</h1>
        <ul className="flex flex-col gap-2">
          {tasks.map(t => (
            <li key={t.id} className="border p-2 rounded">
              <b>{t.content}</b> - {t.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

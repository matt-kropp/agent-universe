'use client';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <ul className="space-y-2">
        {events.map((ev) => (
          <li key={ev.id} className="p-2 border rounded">
            {ev.title}: {new Date(ev.start).toLocaleString()} -
            {new Date(ev.end).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

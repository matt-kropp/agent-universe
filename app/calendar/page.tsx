'use client';
import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div className="flex justify-center">
      <Calendar onChange={(d) => setDate(Array.isArray(d) ? d[0] : d)} value={date} />
    </div>
  );
}

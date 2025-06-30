export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end: string;
}

export const messages: Message[] = [];
export const tasks: Task[] = [
  { id: '1', title: 'Review draft', status: 'pending' },
  { id: '2', title: 'Schedule meeting', status: 'in-progress' },
];

export const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Kickoff',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  },
];

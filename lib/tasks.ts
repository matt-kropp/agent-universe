import EventEmitter from 'events';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done';
  due?: string; // ISO date string
}

export const tasks: Task[] = [
  { id: '1', title: 'Sample Task', status: 'pending', due: new Date().toISOString() },
];

export const taskEmitter = new EventEmitter();

export function updateTask(id: string, status: Task['status']) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    taskEmitter.emit('update', task);
  }
  return task;
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface Task {
  id: string
  content: string
  status: 'pending' | 'in-progress' | 'done'
}

export interface MemoryItem {
  id: string
  text: string
  visibility: 'private' | 'team' | 'public'
}

export const messages: Message[] = []
export const tasks: Task[] = []
export const memory: MemoryItem[] = []

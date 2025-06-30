import { tasks } from '@/lib/data'

export async function POST(req: Request, context: any) {
  const body = await req.json()
  if (body.action === 'completeTask') {
    const task = tasks.find(t => t.id === body.taskId)
    if (task) {
      task.status = 'done'
      return Response.json({ ok: true })
    }
  }
  return new Response('Bad request', { status: 400 })
}

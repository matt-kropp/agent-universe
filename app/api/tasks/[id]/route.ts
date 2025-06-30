import { tasks } from '@/lib/data'

export async function POST(req: Request, context: any) {
  const { params } = context
  const body = await req.json()
  const task = tasks.find(t => t.id === params.id)
  if (task) {
    task.status = body.status || task.status
    return Response.json({ ok: true, task })
  }
  return new Response('Not found', { status: 404 })
}

import { memory } from '@/lib/data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() || ''
  const results = memory.filter(m => m.text.toLowerCase().includes(q))
  return Response.json({ results })
}

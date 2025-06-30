import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Agentic Workflow Platform</h1>
      <p>Select a page to explore:</p>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <Link href="/chat" className="text-blue-600 underline">Chat</Link>
        </li>
        <li>
          <Link href="/inbox" className="text-blue-600 underline">Inbox</Link>
        </li>
        <li>
          <Link href="/calendar" className="text-blue-600 underline">Calendar</Link>
        </li>
        <li>
          <Link href="/admin/marketplace" className="text-blue-600 underline">
            Marketplace
          </Link>
        </li>
      </ul>
    </div>
  );
}

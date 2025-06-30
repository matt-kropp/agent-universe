import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="flex gap-4 p-4 border-b border-gray-300 text-sm">
      <Link href="/chat">Chat</Link>
      <Link href="/inbox">Inbox</Link>
      <Link href="/calendar">Calendar</Link>
      <Link href="/admin/marketplace">Marketplace</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}

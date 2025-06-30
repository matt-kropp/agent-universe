import Nav from '@/components/Nav'

export default function Home() {
  return (
    <div>
      <Nav />
      <main className="p-4">
        <h1 className="text-xl mb-4">Samantha Platform</h1>
        <p>Welcome. Use the navigation to access Chat, Inbox, Calendar and more.</p>
      </main>
    </div>
  )
}

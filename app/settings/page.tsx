'use client'
import Nav from '@/components/Nav'

export default function Settings() {
  return (
    <div>
      <Nav />
      <div className="p-4">
        <h1 className="text-xl mb-2">Settings</h1>
        <p>Manage your profile and API keys.</p>
      </div>
    </div>
  )
}

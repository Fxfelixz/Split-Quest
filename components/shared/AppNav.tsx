'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AppNav() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <a href="/dashboard" className="app-nav-brand">
          Split<b>Quest</b>
        </a>
        <button onClick={handleSignOut} className="app-nav-signout">
          Sign out
        </button>
      </div>
    </nav>
  )
}

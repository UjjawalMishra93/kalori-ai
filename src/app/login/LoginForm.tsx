'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  // Prefetch /dashboard as soon as login page mounts — when user logs in
  // the route is already in the cache, making the redirect feel instant
  useEffect(() => {
    router.prefetch('/dashboard')
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Invalid credentials. Please try again.')
      setLoading(false)
      return
    }

    // Single navigation — router.refresh() after push causes a double render cascade.
    // push() alone is sufficient; the proxy middleware refreshes the session automatically.
    toast.success('Logging in…')
    router.push('/dashboard')
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // No artificial delay — redirect immediately
    toast.success('Account created! Setting up your dashboard…')
    router.push('/dashboard')
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 transition-all text-[#1a1a1a]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 transition-all text-[#1a1a1a]"
        />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70 flex justify-center items-center h-12"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log in'}
        </button>
        <button
          onClick={handleSignUp}
          disabled={loading || !email || !password}
          className="w-full bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-200 py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70 flex justify-center items-center h-12"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign up'}
        </button>
      </div>
    </form>
  )
}

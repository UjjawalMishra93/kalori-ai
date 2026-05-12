'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Registration successful! Redirecting to Dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    }
    
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Invalid credentials. Please try again.')
    } else {
      toast.success('Successfully logged in!')
      router.push('/dashboard')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex justify-center mb-8">
          <Link href="/" className="w-12 h-12 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg shadow-purple-500/30">
            <Zap className="w-7 h-7 fill-current" />
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-[#1a1a1a] mb-8">Welcome to Kalori AI</h2>
        
        <form className="flex flex-col gap-5">
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

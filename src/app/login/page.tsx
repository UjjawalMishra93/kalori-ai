'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="flex flex-col items-center justify-center mb-10 gap-5">
          <Link href="/" className="hover:scale-105 transition-transform">
            <Image src="/images/logo.png" alt="Kalori AI Logo" width={112} height={112} className="w-28 h-28 object-contain drop-shadow-xl scale-125" />
          </Link>
          <Image src="/images/kaloriai.png" alt="Kalori AI" width={280} height={80} className="h-20 w-auto object-contain scale-[1.8]" />
        </div>
        
        <h2 className="text-xl font-medium text-center text-gray-500 mb-8">Welcome back</h2>
        
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

// Server Component — SSR'd instantly, no JS needed to paint the shell.
// Only <LoginForm> (the interactive part) is a client component.
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Log In — Kalori AI',
  description: 'Sign in to your Kalori AI account to track your nutrition.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col items-center justify-center mb-10 gap-5">
          <Link href="/" className="hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Kalori AI Logo"
              width={112}
              height={112}
              priority
              className="w-28 h-28 object-contain drop-shadow-xl scale-125"
            />
          </Link>
          <Image
            src="/images/kaloriai.png"
            alt="Kalori AI"
            width={280}
            height={80}
            priority
            className="h-20 w-auto object-contain scale-[1.8]"
          />
        </div>

        <h2 className="text-xl font-medium text-center text-gray-500 mb-8">Welcome back</h2>

        {/* LoginForm is the only client component — keeps the interactive shell tiny */}
        <LoginForm />
      </div>
    </div>
  )
}

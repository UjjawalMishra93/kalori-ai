import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Activity, ShieldCheck } from 'lucide-react'
import ProfileEditorClient from './ProfileEditorClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  const meta = user?.user_metadata || {}

  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-[#8b5cf6]" /> My Profile
        </h1>
        <p className="text-gray-500">Manage your account information and view your stats.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <ProfileEditorClient user={user} joinedDate={joinedDate} />

        {/* Right Column: Calculated Stats Overview */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#8b5cf6]" /> Current Body Profile
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Gender</div>
              <div className="text-lg font-bold text-[#1a1a1a] capitalize">{meta.gender || 'N/A'}</div>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Age</div>
              <div className="text-lg font-bold text-[#1a1a1a]">{meta.age || 'N/A'} yrs</div>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Weight</div>
              <div className="text-lg font-bold text-[#1a1a1a]">{meta.weight || 'N/A'} kg</div>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Height</div>
              <div className="text-lg font-bold text-[#1a1a1a]">{meta.height || 'N/A'} cm</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" /> Account Security
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-2xl">
              <div>
                <div className="font-bold text-[#1a1a1a]">Password</div>
                <div className="text-sm text-gray-500">Last changed recently</div>
              </div>
              <button className="text-sm font-bold text-[#8b5cf6] hover:underline">Change</button>
            </div>
            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-2xl">
              <div>
                <div className="font-bold text-[#1a1a1a]">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">Add an extra layer of security</div>
              </div>
              <button className="text-sm font-bold text-[#8b5cf6] hover:underline">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

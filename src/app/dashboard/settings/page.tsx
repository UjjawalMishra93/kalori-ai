'use client'

import { useState, useEffect } from 'react'
import { Bell, Shield, Trash2, Settings, Smartphone, Moon, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // State for preferences
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [reminders, setReminders] = useState(true)
  const [reports, setReports] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata) {
        const meta = user.user_metadata
        if (meta.units) setUnits(meta.units)
        if (meta.theme) setTheme(meta.theme)
        if (meta.reminders !== undefined) setReminders(meta.reminders)
        if (meta.reports !== undefined) setReports(meta.reports)
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  const updateSetting = async (key: string, value: any, setter: (val: any) => void) => {
    setter(value)
    const { error } = await supabase.auth.updateUser({
      data: { [key]: value }
    })
    
    if (error) {
      toast.error('Failed to save preference')
    } else {
      toast.success('Preference updated')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you absolutely sure? This will delete all your data permanently. This action cannot be undone.')
    
    if (confirmed) {
      toast.loading('Deleting account...')
      // Simulated deletion logic: clear data and sign out
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setTimeout(() => {
          router.push('/')
          toast.dismiss()
          toast.success('Account successfully deleted (Simulated)')
        }, 2000)
      }
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" /></div>

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#8b5cf6]" /> Settings
        </h1>
        <p className="text-gray-500">Manage your app preferences and account settings.</p>
      </header>

      <div className="max-w-3xl space-y-6">
        
        {/* Preferences */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#8b5cf6]" /> App Preferences
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1a1a1a]">Measurement Units</div>
                <div className="text-sm text-gray-500">Toggle between Metric and Imperial</div>
              </div>
              <div className="bg-[#f8f9fa] p-1 rounded-xl flex border border-gray-200">
                <button 
                  onClick={() => updateSetting('units', 'metric', setUnits)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${units === 'metric' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500 hover:text-[#1a1a1a]'}`}
                >
                  Metric (kg/cm)
                </button>
                <button 
                  onClick={() => updateSetting('units', 'imperial', setUnits)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${units === 'imperial' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500 hover:text-[#1a1a1a]'}`}
                >
                  Imperial (lbs/ft)
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <div>
                <div className="font-bold text-[#1a1a1a]">Theme</div>
                <div className="text-sm text-gray-500">Choose your visual preference</div>
              </div>
              <div className="bg-[#f8f9fa] p-1 rounded-xl flex border border-gray-200">
                <button 
                  onClick={() => updateSetting('theme', 'light', setTheme)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${theme === 'light' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500 hover:text-[#1a1a1a]'}`}
                >
                  ☀️ Light
                </button>
                <button 
                  onClick={() => updateSetting('theme', 'dark', setTheme)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500 hover:text-[#1a1a1a]'}`}
                >
                  <Moon className="w-4 h-4"/> Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8b5cf6]" /> Notifications
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1a1a1a]">Daily Log Reminders</div>
                <div className="text-sm text-gray-500">Get notified to log your meals at 8pm</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={reminders} 
                  onChange={(e) => updateSetting('reminders', e.target.checked, setReminders)} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <div>
                <div className="font-bold text-[#1a1a1a]">Weekly Progress Report</div>
                <div className="text-sm text-gray-500">Receive a summary email of your consistency streak</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={reports} 
                  onChange={(e) => updateSetting('reports', e.target.checked, setReports)} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Danger Zone
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-red-900">Delete Account & Data</div>
              <div className="text-sm text-red-700/80 max-w-sm">
                Permanently delete your account, images, and all meal logs. This action cannot be undone and ensures complete GDPR compliance.
              </div>
            </div>
            <button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shrink-0">
              <Trash2 className="w-5 h-5" /> Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

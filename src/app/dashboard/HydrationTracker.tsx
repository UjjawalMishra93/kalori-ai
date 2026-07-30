'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Droplet, Plus, Minus } from 'lucide-react'

const DAILY_TARGET_ML = 2500
const CUP_ML = 250

export default function HydrationTracker({
  userId,
  initialIntake = 0,
}: {
  userId: string
  initialIntake?: number
}) {
  // Use ref for supabase client — avoid creating a new instance on every render
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [intake, setIntake] = useState(initialIntake)
  const todayKey = new Date().toISOString().split('T')[0]

  const updateIntake = async (newAmount: number) => {
    const clamped = Math.max(0, newAmount)
    setIntake(clamped) // optimistic update — feels instant
    await supabase
      .from('hydration_logs')
      .upsert({ user_id: userId, log_date: todayKey, amount_ml: clamped }, { onConflict: 'user_id,log_date' })
  }

  const pct = Math.min((intake / DAILY_TARGET_ML) * 100, 100)
  const liters = (intake / 1000).toFixed(1)
  const targetLiters = (DAILY_TARGET_ML / 1000).toFixed(1)

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1a1a1a]">Hydration</h2>
        <Droplet className="w-5 h-5 text-blue-400" />
      </div>

      <div className="flex justify-between items-end mb-4">
        <div className="text-3xl font-bold text-[#1a1a1a]">
          {liters}<span className="text-lg text-gray-400">/{targetLiters}L</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateIntake(intake - CUP_ML)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => updateIntake(intake + CUP_ML)}
            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {pct >= 100 ? '🎉 Daily goal reached!' : `${Math.round(pct)}% — ${((DAILY_TARGET_ML - intake) / 1000).toFixed(1)}L to go`}
      </p>

      {/* Cup bubbles */}
      <div className="flex gap-1 mt-4 flex-wrap">
        {Array.from({ length: Math.floor(DAILY_TARGET_ML / CUP_ML) }).map((_, i) => (
          <button
            key={i}
            onClick={() => updateIntake((i + 1) * CUP_ML)}
            title={`${((i + 1) * CUP_ML / 1000).toFixed(2)}L`}
            className={`w-5 h-5 rounded-full transition-all ${
              i < Math.floor(intake / CUP_ML) ? 'bg-blue-400' : 'bg-gray-100 hover:bg-blue-100'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

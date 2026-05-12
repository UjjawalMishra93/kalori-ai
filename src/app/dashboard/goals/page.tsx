'use client'

import { useState, useEffect } from 'react'
import { Target, Save, Loader2, Activity } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function GoalsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [activity, setActivity] = useState<number>(1.55)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata) {
        const meta = user.user_metadata
        if (meta.goal) setGoal(meta.goal)
        if (meta.gender) setGender(meta.gender)
        if (meta.age) setAge(meta.age.toString())
        if (meta.weight) setWeight(meta.weight.toString())
        if (meta.height) setHeight(meta.height.toString())
        if (meta.activity_level) setActivity(meta.activity_level)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    
    // 1. Calculate BMR (Mifflin-St Jeor)
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseInt(age)
    
    let bmr = (10 * w) + (6.25 * h) - (5 * a)
    bmr = gender === 'male' ? bmr + 5 : bmr - 161

    // 2. Calculate TDEE
    let tdee = Math.round(bmr * activity)

    // 3. Adjust for Goal
    if (goal === 'lose') tdee -= 500
    if (goal === 'gain') tdee += 500

    // 4. Calculate Macros
    const protein = Math.round(w * 2)
    const fats = Math.round(w * 0.8)
    const carbs = Math.max(0, Math.round((tdee - (protein * 4) - (fats * 9)) / 4))

    const { error } = await supabase.auth.updateUser({
      data: {
        goal, gender, age: a, weight: w, height: h, activity_level: activity,
        target_calories: tdee,
        target_protein: protein,
        target_carbs: carbs,
        target_fats: fats
      }
    })

    setSaving(false)

    if (error) {
      toast.error('Failed to update goals')
    } else {
      toast.success('Macros successfully recalculated & saved!')
      router.refresh()
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" /></div>

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-[#8b5cf6]" /> Macro Goals & TDEE
        </h1>
        <p className="text-gray-500">Update your body metrics to recalculate your daily calorie and macro targets.</p>
      </header>

      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Primary Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none bg-white font-medium text-[#1a1a1a]">
              <option value="lose">Lose Weight (Deficit)</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Build Muscle (Surplus)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Activity Level</label>
            <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none bg-white font-medium text-[#1a1a1a]">
              <option value={1.2}>Sedentary (Office job, little exercise)</option>
              <option value={1.375}>Lightly Active (Exercise 1-3 days/wk)</option>
              <option value={1.55}>Moderately Active (Exercise 3-5 days/wk)</option>
              <option value={1.725}>Very Active (Heavy exercise 6-7 days/wk)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Biological Sex</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none bg-white font-medium text-[#1a1a1a]">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none font-bold text-[#1a1a1a]" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none font-bold text-[#1a1a1a]" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none font-bold text-[#1a1a1a]" />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 disabled:opacity-70">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Recalculate & Save
          </button>
        </div>
      </div>
    </div>
  )
}

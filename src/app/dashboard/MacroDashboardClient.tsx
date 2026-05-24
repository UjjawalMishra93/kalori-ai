'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Camera, Zap, Plus, Utensils } from 'lucide-react'
import Link from 'next/link'

type Meal = {
  id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  confidence?: number
  created_at: string
  image_url?: string | null
}

const MacroRing = ({
  progress, color, label, value, target, radius = 36, strokeWidth = 8,
}: { progress: number; color: string; label: string; value: string; target: string; radius?: number; strokeWidth?: number }) => {
  const circumference = 2 * Math.PI * radius
  const safeProgress = Math.min(Math.max(progress, 0), 100)
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference
  const size = radius * 2 + strokeWidth * 2
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 absolute inset-0" width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-gray-100" />
          <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${color}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-lg text-[#1a1a1a]">{value}</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="text-sm font-bold text-[#1a1a1a]">{label}</div>
        <div className="text-xs text-gray-500">{target} target</div>
      </div>
    </div>
  )
}

export default function MacroDashboardClient({
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFats,
  userId,
}: {
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFats: number
  userId: string
}) {
  const supabase = createClient()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMeals = useCallback(async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data } = await supabase
      .from('meal_items')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
    setMeals(data || [])
    setLoading(false)
  }, [supabase, userId])

  useEffect(() => {
    fetchMeals()
    // Realtime subscription — updates macro rings instantly when a new meal is saved
    const channel = supabase
      .channel('meal_items_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_items',
        filter: `user_id=eq.${userId}`,
      }, () => {
        fetchMeals()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchMeals, supabase, userId])

  const consumedCalories = meals.reduce((s, m) => s + m.calories, 0)
  const consumedProtein = meals.reduce((s, m) => s + m.protein, 0)
  const consumedCarbs = meals.reduce((s, m) => s + m.carbs, 0)
  const consumedFats = meals.reduce((s, m) => s + m.fats, 0)
  const caloriesLeft = Math.max(0, targetCalories - consumedCalories)
  const calPercent = targetCalories > 0 ? (consumedCalories / targetCalories) * 100 : 0
  const isOverBudget = consumedCalories > targetCalories

  if (loading) {
    return (
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 h-64 animate-pulse" />
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 h-48 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      {/* Daily Overview Card */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Daily Summary</h2>
          <Link href="/dashboard/goals" className="text-sm font-medium text-[#8b5cf6] flex items-center gap-1 hover:underline">
            Edit Goals
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Calorie Ring */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-48 h-48">
              <svg className="transform -rotate-90 absolute inset-0" width="192" height="192">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                <circle
                  cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * 84}
                  strokeDashoffset={(2 * Math.PI * 84) - (calPercent / 100) * (2 * Math.PI * 84)}
                  className={`transition-all duration-1000 ease-out drop-shadow-md ${isOverBudget ? 'text-red-500' : 'text-[#8b5cf6]'}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black transition-colors ${isOverBudget ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
                  {isOverBudget ? `+${consumedCalories - targetCalories}` : caloriesLeft}
                </span>
                <span className={`text-sm font-medium mt-1 ${isOverBudget ? 'text-red-400' : 'text-gray-500'}`}>
                  {isOverBudget ? 'Over budget' : 'Cal Left'}
                </span>
              </div>
            </div>
            <div className="text-sm font-bold text-gray-400 mt-4">Target: {targetCalories} kcal</div>
            {/* Over/under badge */}
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
              isOverBudget ? 'bg-red-100 text-red-600' :
              calPercent >= 90 ? 'bg-amber-100 text-amber-600' :
              'bg-green-100 text-green-600'
            }`}>
              {isOverBudget ? '🔴 Over budget' : calPercent >= 90 ? '🟡 Almost there' : '🟢 On track'}
            </div>
          </div>

          {/* Macro Rings */}
          <div className="flex gap-6 w-full justify-center md:w-auto">
            <MacroRing progress={(consumedProtein/targetProtein)*100} color="text-green-500" label="Protein" value={`${consumedProtein}g`} target={`${targetProtein}g`} />
            <MacroRing progress={(consumedCarbs/targetCarbs)*100} color="text-orange-400" label="Carbs" value={`${consumedCarbs}g`} target={`${targetCarbs}g`} />
            <MacroRing progress={(consumedFats/targetFats)*100} color="text-blue-500" label="Fats" value={`${consumedFats}g`} target={`${targetFats}g`} />
          </div>
        </div>
      </div>

      {/* Today's Meals Timeline */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Today&apos;s Meals</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{meals.length} Logged</span>
        </div>

        <div className="space-y-4">
          {meals.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
              <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No meals logged today</p>
              <p className="text-xs text-gray-400">Scan your first meal to see it here.</p>
            </div>
          ) : (
            meals.map((meal) => {
              const mealTime = new Date(meal.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
              return (
                <div key={meal.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8f9fa] border border-gray-100 group hover:border-[#8b5cf6]/30 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                    {meal.image_url ? (
                      <img src={meal.image_url} alt={meal.food_name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1a1a1a]">{meal.food_name}</h4>
                    <p className="text-xs text-gray-500">{mealTime} • {meal.confidence ? `AI Scanned (${meal.confidence}%)` : 'Manual Entry'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-[#1a1a1a]">{meal.calories} kcal</div>
                    <div className="text-xs text-gray-500 flex gap-2 justify-end mt-1">
                      <span className="text-green-500">{meal.protein}g P</span>
                      <span className="text-orange-400">{meal.carbs}g C</span>
                      <span className="text-blue-500">{meal.fats}g F</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}

          <Link href="/dashboard/scan" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#8b5cf6] hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/5 transition-all font-medium mt-4">
            <Plus className="w-5 h-5" /> Log a snack
          </Link>
        </div>
      </div>
    </div>
  )
}

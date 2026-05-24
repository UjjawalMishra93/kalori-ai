'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function updateStreakAndStats(userId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
    return
  }
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0]
  
  const { data: stats } = await supabaseAdmin
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!stats) {
    await supabaseAdmin.from('user_stats').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_log_date: today,
      total_meals_logged: 1,
    })
  } else {
    let newStreak = stats.current_streak

    if (stats.last_log_date === today) {
      await supabaseAdmin.from('user_stats').update({
        total_meals_logged: stats.total_meals_logged + 1,
        updated_at: now.toISOString(),
      }).eq('user_id', userId)
    } else if (stats.last_log_date === yesterdayStr) {
      newStreak += 1
      await supabaseAdmin.from('user_stats').update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, stats.longest_streak),
        last_log_date: today,
        total_meals_logged: stats.total_meals_logged + 1,
        updated_at: now.toISOString(),
      }).eq('user_id', userId)
    } else {
      newStreak = 1
      await supabaseAdmin.from('user_stats').update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, stats.longest_streak),
        last_log_date: today,
        total_meals_logged: stats.total_meals_logged + 1,
        updated_at: now.toISOString(),
      }).eq('user_id', userId)
    }
  }
}

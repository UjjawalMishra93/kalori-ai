import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Camera, Target, Flame } from 'lucide-react';
import Link from 'next/link';
import MacroDashboardClient from './MacroDashboardClient';
import HydrationTracker from './HydrationTracker';
import ProteinChart from './ProteinChart';



export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Extract dynamic targets from user metadata (set during onboarding)
  const meta = user?.user_metadata || {};
  const targetCalories = meta.target_calories || 2200;
  const targetProtein = meta.target_protein || 150;
  const targetCarbs = meta.target_carbs || 200;
  const targetFats = meta.target_fats || 60;

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // 4. Fetch User Stats (Streaks)
  const { data: userStats } = await supabase
    .from('user_stats')
    .select('current_streak')
    .eq('user_id', user.id)
    .single();

  const currentStreak = userStats?.current_streak || 0;

  // 5. Calculate Weekly Activity (for the checkmarks)
  const startOfWeek = new Date();
  const dayOfWeek = startOfWeek.getDay(); // 0 is Sunday, 1 is Monday...
  // Adjust to Monday as start of week
  const diffToMonday = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data: weeklyMeals } = await supabase
    .from('meal_items')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', startOfWeek.toISOString());

  const activeDays = new Set();
  weeklyMeals?.forEach((meal: any) => {
    activeDays.add(new Date(meal.created_at).getDay());
  });

  const uiDays = [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday
  const todayDay = new Date().getDay();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#8b5cf6] font-bold text-sm tracking-wider uppercase mb-1">{dateStr}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">Good morning, {meta.name || user?.email?.split('@')[0]}</h1>
        </div>
        <Link href="/dashboard/scan" className="bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/30 shrink-0">
          <Camera className="w-5 h-5" /> Scan Meal
        </Link>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Macro Dashboard — Realtime Client Component */}
        <MacroDashboardClient
          targetCalories={targetCalories}
          targetProtein={targetProtein}
          targetCarbs={targetCarbs}
          targetFats={targetFats}
          userId={user.id}
        />

        {/* Right Column: Insights & Streaks */}
        <div className="flex flex-col gap-6">
          
          {/* Consistency Streak Widget */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d1b69] p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-20">
              <Flame className="w-48 h-48 text-orange-500" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-gray-400 text-sm font-medium mb-1">Consistency Streak</div>
                  <div className="text-4xl font-bold flex items-center gap-2">
                    {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-6">You're in the top 5% of users this week. Keep hitting that protein goal!</p>
              
              <div className="flex justify-between">
                {['M','T','W','T','F','S','S'].map((day, i) => {
                  const dayIdx = uiDays[i];
                  const isActive = activeDays.has(dayIdx);
                  const isToday = dayIdx === todayDay;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isActive 
                          ? 'bg-[#8b5cf6] text-white' 
                          : isToday 
                            ? 'bg-white/20 text-white ring-2 ring-[#8b5cf6]' 
                            : 'bg-white/10 text-gray-500'
                      }`}>
                        {isActive ? '✓' : ''}
                      </div>
                      <span className={`text-[10px] ${isToday ? 'text-white font-bold' : 'text-gray-400'}`}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hydration Tracker — Connected to DB */}
          <HydrationTracker userId={user.id} />

          {/* 7-day Protein Hit Rate Chart */}
          <ProteinChart targetProtein={targetProtein} userId={user.id} />

          {/* Setup Profile Prompt */}
          <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 p-6 rounded-[32px]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#8b5cf6]/20 rounded-full flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] mb-1">Update your TDEE</h3>
                <p className="text-sm text-gray-600 mb-3">Your body stats haven't been updated in 30 days. Recalculate your goals for accurate tracking.</p>
                <Link href="/dashboard/goals" className="text-sm font-bold text-[#8b5cf6] hover:underline">
                  Recalculate Now
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

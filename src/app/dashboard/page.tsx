import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Camera, Zap, Activity, Target, Flame, ChevronRight, Utensils, Droplet, Plus } from 'lucide-react';
import Link from 'next/link';

// Helper component for SVG Circular Progress Rings
const MacroRing = ({ 
  progress, 
  color, 
  label, 
  value, 
  target,
  radius = 36,
  strokeWidth = 8
}: { 
  progress: number; 
  color: string; 
  label: string; 
  value: string; 
  target: string;
  radius?: number;
  strokeWidth?: number;
}) => {
  const circumference = 2 * Math.PI * radius;
  // Cap progress at 100% for the ring visual
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;
  const size = radius * 2 + strokeWidth * 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 absolute inset-0" width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-gray-100" />
          <circle 
            cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
            className={`transition-all duration-1000 ease-out ${color}`} 
            strokeLinecap="round" 
          />
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
  );
};

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

  // 2. Fetch today's meals from Supabase
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: meals, error } = await supabase
    .from('meal_items')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  const safeMeals = meals || [];

  // 3. Sum up consumed macros from the real database
  const consumedCalories = safeMeals.reduce((sum: number, meal: any) => sum + meal.calories, 0);
  const consumedProtein = safeMeals.reduce((sum: number, meal: any) => sum + meal.protein, 0);
  const consumedCarbs = safeMeals.reduce((sum: number, meal: any) => sum + meal.carbs, 0);
  const consumedFats = safeMeals.reduce((sum: number, meal: any) => sum + meal.fats, 0);

  const caloriesLeft = Math.max(0, targetCalories - consumedCalories);
  const calPercent = targetCalories > 0 ? (consumedCalories / targetCalories) * 100 : 0;

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
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">Good morning, {user?.email?.split('@')[0]}</h1>
        </div>
        <Link href="/dashboard/scan" className="bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/30 shrink-0">
          <Camera className="w-5 h-5" /> Scan Meal
        </Link>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Macro Dashboard (Takes up 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Daily Overview Card */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Daily Summary</h2>
              <button className="text-sm font-medium text-[#8b5cf6] flex items-center gap-1 hover:underline">
                Edit Goals <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-10">
              {/* Massive Calorie Ring */}
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center w-48 h-48">
                  <svg className="transform -rotate-90 absolute inset-0" width="192" height="192">
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                    <circle 
                      cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 84} strokeDashoffset={(2 * Math.PI * 84) - (calPercent / 100) * (2 * Math.PI * 84)} 
                      className="text-[#8b5cf6] transition-all duration-1000 ease-out drop-shadow-md" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-[#1a1a1a]">{caloriesLeft}</span>
                    <span className="text-sm text-gray-500 font-medium mt-1">Cal Left</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-400 mt-4">Target: {targetCalories} kcal</div>
              </div>

              {/* Smaller Macro Rings */}
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
              <h2 className="text-xl font-bold text-[#1a1a1a]">Today's Meals</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{safeMeals.length} Logged</span>
            </div>

            <div className="space-y-4">
              {safeMeals.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                  <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No meals logged today</p>
                  <p className="text-xs text-gray-400">Scan your first meal to see it here.</p>
                </div>
              ) : (
                safeMeals.map((meal: any) => {
                  const mealTime = new Date(meal.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
                        <p className="text-xs text-gray-500">{mealTime} • {meal.confidence ? `Scanned via AI (${meal.confidence}%)` : 'Manual Entry'}</p>
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
                  );
                })
              )}

              {/* Add Meal Placeholder */}
              <Link href="/dashboard/scan" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#8b5cf6] hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/5 transition-all font-medium mt-4">
                <Plus className="w-5 h-5" /> Log a snack
              </Link>
            </div>
          </div>
        </div>

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

          {/* Water Tracker Widget */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Hydration</h2>
              <Droplet className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex justify-between items-end mb-4">
              <div className="text-3xl font-bold text-[#1a1a1a]">1.5<span className="text-lg text-gray-400">/2.5L</span></div>
              <button className="bg-blue-50 text-blue-500 hover:bg-blue-100 p-2 rounded-xl transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full w-[60%] transition-all"></div>
            </div>
          </div>

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

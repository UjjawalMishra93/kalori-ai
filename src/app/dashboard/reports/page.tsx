import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ReportsDashboardClient from './ReportsDashboardClient';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Extract dynamic targets from user metadata (set during onboarding)
  const meta = user?.user_metadata || {};
  const targetCalories = meta.target_calories || 2200;
  const targetProtein = meta.target_protein || 150;
  const targetCarbs = meta.target_carbs || 200;
  const targetFats = meta.target_fats || 60;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2">Nutritional Reports</h1>
        <p className="text-gray-500">Analyze your weekly and monthly nutritional trends, and export beautifully designed PDF reports.</p>
      </header>
      
      <ReportsDashboardClient 
        userId={user.id} 
        targetCalories={targetCalories}
        targetProtein={targetProtein}
        targetCarbs={targetCarbs}
        targetFats={targetFats}
        userName={user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
      />
    </div>
  );
}

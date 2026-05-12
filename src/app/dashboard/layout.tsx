import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Zap, User } from 'lucide-react';
import { signOut } from './actions';
import { SidebarNavigation } from './SidebarNavigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect the dashboard route
  if (!user) {
    redirect('/login');
  }

  // Check if the user has completed onboarding
  if (!user.user_metadata?.is_onboarded) {
    redirect('/onboarding');
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            Kalori AI
          </Link>
        </div>

        <SidebarNavigation />

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
              {user.email?.substring(0, 2)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-[#1a1a1a] truncate">{user.email}</span>
              <span className="text-xs text-gray-500">Free Plan</span>
            </div>
          </div>
          <form>
            <button formAction={signOut} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium rounded-xl transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="text-xl font-bold tracking-tight text-black flex items-center gap-2">
            <div className="w-6 h-6 bg-[#8b5cf6] rounded-md flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            Kalori AI
          </div>
          <form>
            <button formAction={signOut} className="text-gray-500 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        <div className="p-6 md:p-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

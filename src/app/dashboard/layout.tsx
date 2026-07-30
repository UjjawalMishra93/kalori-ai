import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { LogOut, Zap, User } from 'lucide-react';
import { signOut } from './actions';
import { SidebarNavigation } from './SidebarNavigation';
import DashboardLoading from './loading';

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
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Kalori AI Logo" width={56} height={56} className="w-14 h-14 object-contain scale-110" />
            <Image src="/images/kaloriai.png" alt="Kalori AI" width={200} height={60} className="h-14 w-auto object-contain scale-[1.6]" />
          </Link>
        </div>

        <SidebarNavigation />

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden shrink-0 shadow-inner">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                (user.user_metadata?.name || user.email)?.substring(0, 2)
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-[#1a1a1a] truncate">
                {user.user_metadata?.name || user.email?.split('@')[0]}
              </span>
              <span className="text-xs text-gray-500 truncate">{user.email}</span>
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
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Kalori AI Logo" width={40} height={40} className="w-10 h-10 object-contain scale-110" />
            <Image src="/images/kaloriai.png" alt="Kalori AI" width={160} height={40} className="h-10 w-auto object-contain scale-[1.6]" />
          </div>
          <form>
            <button formAction={signOut} className="text-gray-500 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        <div className="p-6 md:p-10 w-full">
          <Suspense fallback={<DashboardLoading />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

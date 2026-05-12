import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Header Skeleton */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-12 w-40 rounded-full" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Summary Card Skeleton */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-10">
              {/* Massive Calorie Ring Skeleton */}
              <div className="flex flex-col items-center">
                <Skeleton className="w-48 h-48 rounded-full" />
                <Skeleton className="h-4 w-32 mt-4" />
              </div>

              {/* Smaller Macro Rings Skeletons */}
              <div className="flex gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="h-4 w-16 mt-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Meals Timeline Skeleton */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Streak Widget Skeleton */}
          <Skeleton className="h-[280px] w-full rounded-[32px]" />
          
          {/* Water Tracker Skeleton */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-5" />
            </div>
            <div className="flex justify-between items-end mb-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          {/* Prompt Widget Skeleton */}
          <Skeleton className="h-32 w-full rounded-[32px]" />
        </div>
      </div>
    </div>
  )
}
